import React, { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin, o } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

import Header from "./Header";

function Login() {
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
      navigate("/GetMail");

      console.log("Response", codeResponse);
      localStorage.setItem("Token", JSON.stringify(codeResponse));
    },
    onError: (error) => console.log("Login Failed:", error),
  });
  //   const Log = () => {
  //     let data = useGoogleLogin({
  //       onSuccess: (codeResponse) => setUser(codeResponse),
  //       onError: (error) => console.log("Login Failed:", error),
  //     });
  //     console.log("Data", data);
  //   };

  useEffect(() => {
    if (user) {
      // Navigate("/GetMail");
      // axios
      //   .get(
      //     `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
      //     {
      //       headers: {
      //         Authorization: `Bearer ${user.access_token}`,
      //         Accept: "application/json",
      //       },
      //     }
      //   )
      //   .then((res) => {
      //     console.log("Get CLint Response", res);
      //     localStorage.setItem("Info", res);
      //     setProfile(res.data);
      //   })
      //   .catch((err) => console.log(err));
    }
  }, [user]);

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <div>
      <Header />
      <Container>
        <Button className="mt-5 " onClick={() => login()}>
          Sign in with Google 🚀{" "}
              </Button>
              
        {/* <div
          id="g_id_onload"
          data-client_id="1064787533834-btg90n76s1plli7kerq74rjp6ke9bek5.apps.googleusercontent.com"
          data-context="signin"
          data-ux_mode="popup"
          data-login_uri="http://localhost:3000"
          data-auto_prompt="false"
        ></div>

        <div
          class="g_id_signin"
          data-type="standard"
          data-shape="pill"
          data-theme="filled_blue"
          data-text="continue_with"
          data-size="large"
          data-locale="en"
          data-logo_alignment="left"
        ></div> */}
      </Container>
    </div>
  );
}
export default Login;
