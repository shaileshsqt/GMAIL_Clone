import React, { useState, useEffect } from "react";
import { googleLogout } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./Header";

function GetMail() {
  const [profile, setProfile] = useState([]);
  const GET_Data = JSON.parse(localStorage.getItem("Token"));
  const [user, setUser] = useState(GET_Data);
  const navigate = useNavigate();

  const CLIENT_ID = "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";
  const REDIRECT_URI = "http://localhost:3000/GetMail";
  const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

  useEffect(() => {
    console.log("inside useeffect::", user);
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          localStorage.setItem("UserInfo", JSON.stringify(res));
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  //   const getMailList = () => {
  //     console.log("profile", profile);
  //     axios
  //       .get(
  //         `https://gmail.googleapis.com/gmail/v1/users/${profile.email}/profile`,
  //         {
  //           headers: new Headers({
  //             Authorization: `Bearer ${user.access_token}`,
  //             Accept: "application/json",
  //           }),
  //         }
  //       )
  //       .then((res) => {
  //         console.log("get Mail List", res);
  //       })
  //       .catch((err) => console.log(err));
  //   };

  //   const getMail = () => {
  //     axios
  //       .get(
  //         ` https://gmail.googleapis.com/gmail/v1/users/${profile.email}/threads`,
  //         {
  //           headers: new Headers({
  //             Authorization: `Bearer ${user.access_token}`,
  //             Accept: "application/json",
  //           }),
  //         }
  //       )
  //       .then((res) => {
  //         console.log("get Mail List", res);
  //       })
  //       .catch((err) => console.log(err));
  //   };

  //   const generateAuthUrl = () => {
  //     const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join(
  //       " "
  //     )}&response_type=code&access_type=offline`;

  //     console.log("Display AUth", authUrl);
  //     return authUrl;
  //   };

  //   function authenticate() {
  //     return gapi.auth2
  //       .getAuthInstance()
  //       .signIn({
  //         scope:
  //           "https://mail.google.com/ https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.readonly",
  //       })
  //       .then(
  //         function () {
  //           console.log("Sign-in successful");
  //         },
  //         function (err) {
  //           console.error("Error signing in", err);
  //         }
  //       );
  //   }
  //   function loadClient() {
  //     gapi.client.setApiKey("AIzaSyCDjnNJT_9k4o7FuLBM6cjNyob01P2T1u4");
  //     return gapi.client
  //       .load("https://gmail.googleapis.com/$discovery/rest?version=v1")
  //       .then(
  //         function () {
  //           console.log("GAPI client loaded for API");
  //         },
  //         function (err) {
  //           console.error("Error loading GAPI client for API", err);
  //         }
  //       );
  //   }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  //   function execute() {
  //     return gapi.client.gmail.users.messages
  //       .list({
  //         userId: "shailesh.barad@softqubes.com",
  //       })
  //       .then(
  //         function (response) {
  //           // Handle the results here (response.result has the parsed body).
  //           console.log("Response", response);
  //         },
  //         function (err) {
  //           console.error("Execute error", err);
  //         }
  //       );
  //   }
  //   gapi.load("client:auth2", function () {
  //     gapi.auth2.init({
  //       client_id:
  //         "1064787533834-btg90n76s1plli7kerq74rjp6ke9bek5.apps.googleusercontent.com",
  //     });
  //   });

  return (
    <div>
      <Header />
      <Container>
        <h2>React Google Login</h2>
        <br />
        <br />
        {profile ? (
          <div>
            <img src={profile.picture} alt="user image" />
            <h3>User Logged in</h3>
            <p>Name: {profile.name}</p>
            <p>Email Address: {profile.email}</p>
            <br />
            <br />
            <button onClick={logOut}>Log out</button>
            {/* <button onClick={getMailList}>Get Mail List</button> */}
            {/* <button onClick={getMail}>Get Mail </button> */}

            {/* <a href={generateAuthUrl()}>Click here to authorize Gmail</a> */}
            {/* <button onclick={authenticate().then(loadClient)}>
              authorize and load
            </button>
            <button onclick={execute()}>execute</button> */}
          </div>
        ) : (
          navigate("/")
        )}
      </Container>
    </div>
  );
}
export default GetMail;
