import React, { useEffect, useState } from "react";

const CLIENT_ID =
  "1064787533834-btg90n76s1plli7kerq74rjp6ke9bek5.apps.googleusercontent.com";
const API_KEY = "AIzaSyCDjnNJT_9k4o7FuLBM6cjNyob01P2T1u4";
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest";
const SCOPES = "https://www.googleapis.com/auth/gmail.readonly";

function Trial() {
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [thredId, setthredId] = useState("");

  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://apis.google.com/js/api.js";
    script1.onload = gapiLoaded;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://accounts.google.com/gsi/client";
    script2.onload = gisLoaded;
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  const gapiLoaded = () => {
    window.gapi.load("client", initializeGapiClient);
  };

  const initializeGapiClient = async () => {
    await window.gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    setGapiInited(true);
    maybeEnableButtons();
  };

  const gisLoaded = () => {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: handleTokenResponse,
    });
    setGisInited(true);
    maybeEnableButtons();
  };

  const maybeEnableButtons = () => {
    if (gapiInited && gisInited) {
      document.getElementById("authorize_button").style.visibility = "visible";
    }
  };

  const handleTokenResponse = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    document.getElementById("signout_button").style.visibility = "visible";
    document.getElementById("authorize_button").innerText = "Refresh";
    await listLabels();
  };

  const handleAuthClick = () => {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: handleTokenResponse,
    });

    if (window.gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      tokenClient.requestAccessToken({ prompt: "" });
    }
  };

  const handleSignoutClick = () => {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken("");
      document.getElementById("content").innerText = "";
      document.getElementById("authorize_button").innerText = "Authorize";
      document.getElementById("signout_button").style.visibility = "hidden";
    }
  };

  const listLabels = async () => {
    let response;
    try {
      response = await window.gapi.client.gmail.users.labels.list({
        userId: "me",
      });
    } catch (err) {
      document.getElementById("content").innerText = err.message;
      return;
    }
    const labels = response.result.labels;
    if (!labels || labels.length === 0) {
      document.getElementById("content").innerText = "No labels found.";
      return;
    }
    const output = labels.reduce(
      (str, label) => `${str}${label.name}\n`,
      "Labels:\n"
    );
    document.getElementById("content").innerText = output;
  };

  const ListThreads = async () => {
    let response;
    try {
      response = await window.gapi.client.gmail.users.threads.list({
        userId: "me",
      });
      console.log("List THreads", response.body);
    } catch (err) {
      document.getElementById("list").innerText = err.message;
      return;
    }
    const labels = response.result.labels;
    if (!labels || labels.length === 0) {
      document.getElementById("list").innerText = "No labels found.";
      return;
    }
    const output = labels.reduce(
      (str, label) => `${str}${label.name}\n`,
      "Labels:\n"
    );
    document.getElementById("list").innerText = output;
  };

  return (
    <div>
      <p>Gmail API Quickstart</p>
      <button id="authorize_button" onClick={handleAuthClick}>
        Authorize
      </button>
      <button id="signout_button" onClick={handleSignoutClick}>
        Sign Out
      </button>
      <button id="signout_button" onClick={ListThreads}>
        List Threads
      </button>
      <pre id="content" style={{ whiteSpace: "pre-wrap" }}></pre>
      <pre id="list" style={{ whiteSpace: "pre-wrap" }}></pre>
    </div>
  );
}

export default Trial;
