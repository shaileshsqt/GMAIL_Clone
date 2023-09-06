import React, { useEffect, useState } from "react";
import {
  AuthorizeButton,
  SignoutButton,
  Labels,
  ThreadList,
} from "./gmailList";
import Display from "./Display";
import Gmail_Body from "./Gmail_Body";
import { useNavigate } from "react-router-dom";

const AuthFn = () => {
  const [tokenClient, setTokenClient] = useState(null);
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [labels, setLabels] = useState([]);
  const [Threds, setThreds] = useState([]);
  const [getMessage, setgetmessage] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const CLIENT_ID = process.env.REACT_APP_CLIENTID;

  const API_KEY = process.env.REACT_APP_APIKEY;

  const DISCOVERY_DOC = process.env.REACT_APP_DISCOVERYDOC;

  const SCOPES = process.env.REACT_APP_SCOPES;

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
    localStorage.setItem("Token", JSON.stringify(newTokenClient));
    setGisInited(true);
    maybeEnableButtons();
  };

  const maybeEnableButtons = () => {
    if (gapiInited && gisInited) {
      document.getElementById("signout_button").style.visibility = "visible";
    }
  };

  const handleTokenResponse = async (resp) => {
    console.log("Respo", resp);
    localStorage.setItem("accesToken", resp.access_token);

    if (resp.error !== undefined) {
      throw resp;
    }
    navigate("/Display");
    // await listLabels();
    // await listThreads();
  };

  const listLabels = async () => {
    try {
      const response = await window.gapi.client.gmail.users.labels.list({
        userId: "me",
      });
      const labels = response.result.labels || [];
      setLabels(labels);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };
  const listThreads = async () => {
    try {
      const response = await window.gapi.client.gmail.users.threads.list({
        userId: "me",
      });

      await getmessageArray(response.result.threads);
      const threads = response.result || [];
      setThreds(threads);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const getmessageArray = async (item) => {
    item.forEach(async (element) => {
      try {
        const response = await window.gapi.client.gmail.users.threads.get({
          userId: "me",
          id: element.id,
        });
        setgetmessage(response.result.messages);
        // console.log("get message List @!@!@!@!@!@", response);
      } catch (error) {
        setErrorMessage(err.message);
      }
    });
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
      localStorage.setItem("Token", "");
      setLabels([]);
      setThreds([]);
      setgetmessage([]);
      setErrorMessage("");
      //   document.getElementById("authorize_button").innerText = "Authorize";
      document.getElementById("signout_button").style.visibility = "hidden";
    }
  };

  return (
    <div>
      <div>
        <p>Authorize Gmail API</p>
        <AuthorizeButton tokenClient={tokenClient} />
        <button id="signout_button" onClick={() => handleSignoutClick()}>
          SignOut
        </button>
        {/* <button onClick={() => listThreads()}>threads</button> */}

          {/* <Display
            ThreadList={Threds}
            labels={labels}
            getMessage={getMessage}
            errorMessage={errorMessage}
          /> */}
        {/* <Gmail_Body labels={labels} errorMessage={errorMessage} /> */}
        {/* <Labels labels={labels} errorMessage={errorMessage} /> */}
      </div>
    </div>
  );
};

export default AuthFn;
