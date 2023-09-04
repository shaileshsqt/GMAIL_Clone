import React, { useEffect } from "react";
import { Route, Router, Routes } from "react-router-dom";
import Login from "./Component/Login";
import GetMail from "./Component/GetMail";
import { gapi } from "gapi-script";
import Trial from "./Component/Trial";
import Test from "./Component/Test";
import Home from "./GMAIL/Home";
import Authorize from "./GMAIL/Authorize";
import AuthFn from "./GMAIL/Authorize";
import Gmail_Body from "./GMAIL/Gmail_Body";
import Display from "./GMAIL/Display";

const clientId =
  "1064787533834-btg90n76s1plli7kerq74rjp6ke9bek5.apps.googleusercontent.com";
const App = () => {
  useEffect(() => {
    function start() {
      console.log("Start");
      gapi.client.init({
        clientId: clientId,
        scope: "https://mail.google.com/",
      });
    }
    gapi.load("client:auth2", start);
  });

  return (
    <div>
      <Routes>
        {/* <Route element={<UserInfo />} path="/" /> */}
        {/* <Route element={<Login />} path="/login" />
        <Route element={<GetMail />} path="/GetMail" />
        <Route element={<Trial />} path="/Trial" />
        <Route element={<Test />} path="/" /> */}
        <Route path="/Home" element={<Home />} />
        <Route path="/" element={<AuthFn />} />
        <Route path="/Display" element={<Display />} />
        <Route path="/getBody/:id" element={<Gmail_Body />} />
      </Routes>
    </div>
  );
};

export default App;
