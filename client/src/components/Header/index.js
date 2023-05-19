import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

import Auth from '../../utils/auth';


const styles = {
  background: {
    backgroundColor: '#008080',
    border: 'none'
  }
}


const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <Navbar id='border' variant="light">
      <Container>
        <Nav className="me-auto">
          <Nav.Link style={{ color: 'white', fontSize: '25px' }} as={Link} to="/">⚝ Home</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
