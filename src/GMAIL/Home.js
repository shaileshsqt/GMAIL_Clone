import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <p>Gmail API Quickstart</p>
      <Link to="/authorize">Authorize</Link>
    </div>
  );
};

export default Home;
