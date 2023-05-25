import React, { useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Auth from '../../src/utils/auth';
import Container from 'react-bootstrap/Container';



import '../styles/home.css';

const styles = {
  background : {
    backgroundColor : '#008080',
    border: 'none',
  },
}



const Home = () => {

  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  
  return (
    <main>
      <p id ="heading" style = {styles.text}>The Chatty</p>
      <p style = {styles.text}>OpenAI's chatbot is a product of innovative artificial intelligence technology, interacting with users in various fields and providing valuable conversations. This chatbot is based on the large language model ChatGPT and has great natural language processing capabilities. The OpenAI chatbot understands users' questions and requests and provides appropriate answers.</p>
      <div>
          {Auth.loggedIn() ? (
            <>
            <Container className="d-flex justify-content-center">
              <Button as={Link} variant='info' className="m-2" to="/survey">
                Hi! {Auth.getProfile().data.username}! Do you want to start chatting?
              </Button>
              <Button className="m-2" onClick={logout}>
                Logout
              </Button>
            </Container>
            </>
          ) : (
            <>
              <Container className="d-flex justify-content-center">
                <Button style={{ color: 'white', fontSize: '20px' }} as={Link} className="m-2"  to="/login">
                  Login
                </Button>
                <Button style={{ color: 'white', fontSize: '20px' }} as={Link} className="m-2" to="/signup">
                  Signup
                </Button>
              </Container>
            </>
          )}
        </div>
    </main >
  );
};

export default Home;
