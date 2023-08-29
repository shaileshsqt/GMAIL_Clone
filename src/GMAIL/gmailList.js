export const Labels = ({ labels, errorMessage }) => {
  return (
    <pre className="labels" style={{ whiteSpace: "pre-wrap" }}>
      {errorMessage || labels.map((label) => label.name).join("\n")}
    </pre>
  );
};

export const AuthorizeButton = ({ tokenClient }) => {
  const handleAuthClick = () => {
    if (tokenClient && window.gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      tokenClient.requestAccessToken({ prompt: "" });
    }
  };

  return <button onClick={handleAuthClick}>Authorize</button>;
};

export const SignoutButton = ({ tokenClient }) => {
  const handleSignoutClick = () => {
    const GetToken = JSON.parse(localStorage.getItem("Token"));
    console.log("Get  Delete Token", GetToken);
    // const GetToken = window.gapi.client.getToken();
    // console.log("TOKENNNNNNN", token);
    if (GetToken !== null) {
      google.accounts.oauth2.revoke(GetToken.access_token);
      //   google.accounts.oauth2.revoke(GetToken.access_token);
      window.gapi.client.setToken("");
    }
  };

  return <button onClick={handleSignoutClick}>Sign Out</button>;
};
