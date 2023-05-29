import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

import Auth from '../../utils/auth';
import '../Header/header.css'



const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <div>
    <Navbar id='header' variant="light">
      <Container>
        <Nav className="me-auto">
          <Nav.Link  id='home' as={Link} to="/">⚝ Home</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
    </div>
  );
};

export default Header;
