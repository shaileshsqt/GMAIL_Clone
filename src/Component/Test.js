import React, { useEffect, useState } from "react";

const CLIENT_ID =
  "1064787533834-btg90n76s1plli7kerq74rjp6ke9bek5.apps.googleusercontent.com";
const API_KEY = "AIzaSyCDjnNJT_9k4o7FuLBM6cjNyob01P2T1u4";
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest";
const SCOPES = "https://www.googleapis.com/auth/gmail.readonly";

function Test() {
  const [tokenClient, setTokenClient] = useState(null);
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [labels, setLabels] = useState([]);
  const [thred, setThreds] = useState([]);
  const [thredId, setThredId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    const newTokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: handleTokenResponse,
    });
    setTokenClient(newTokenClient);
    setGisInited(true);
    maybeEnableButtons();
  };

  const maybeEnableButtons = () => {
    if (gapiInited && gisInited) {
      document.getElementById("authorize_button").style.visibility = "visible";
    }
  };

  const handleTokenResponse = async (resp) => {
    console.log("Token Response", resp);
    if (resp.error !== undefined) {
      localStorage.setItem("Token", resp);
      throw resp;
    }
    document.getElementById("signout_button").style.visibility = "visible";
    document.getElementById("authorize_button").innerText = "Refresh";
    await getThreadsList();
    await listLabels();
  };

  const handleAuthClick = () => {
    if (tokenClient && window.gapi.client.getToken() === null) {
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
      setLabels([]);
      setErrorMessage("");
      document.getElementById("authorize_button").innerText = "Authorize";
      document.getElementById("signout_button").style.visibility = "hidden";
    }
  };

  const listLabels = async () => {
    try {
      const response = await window.gapi.client.gmail.users.labels.list({
        userId: "me",
      });
      console.log("Get User Details", response);
      const labels = response.result.labels || [];
      setLabels(labels);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const getThreadsList = async () => {
    try {
      const response = await window.gapi.client.gmail.users.threads.list({
        userId: "me",
        labelIds: "INBOX",
      });
      console.log("Get Threds Details", response.result.threads);
      const labels = response.result.threads || [];
      setThreds(labels);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const getThreadBody = async () => {
    try {
      const response = await window.gapi.client.gmail.users.threads.get({
        userId: "me",
      });
      console.log("Get Threds Details", response.result.threads);
      const labels = response.result.threads || [];
      setThreds(labels);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(err.message);
    }
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
      <pre id="content" style={{ whiteSpace: "pre-wrap" }}>
        {errorMessage || labels.map((label) => label.name).join("\n")}
      </pre>
      <div>
        <table>
          <thead>
            <tr>Thread</tr>
          </thead>
          <tbody>
            {thred.map((item) => {
              return (
                <tr>
                  <td> {item.snippet}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* {errorMessage ||
          thred
            .map((thred) => {
              thred.snippet;
            })
            .join("\n")} */}
      </div>
    </div>
  );
}

export default Test;
