import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import "../App.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Gmail Demo
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;
