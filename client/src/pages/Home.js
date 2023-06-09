import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useApolloClient, useMutation } from '@apollo/client';
import Auth from '../../src/utils/auth';
import Container from 'react-bootstrap/Container';
import { DELETE_ALL_DATA } from '../utils/mutations';

import '../styles/home.css';

const styles = {
  background: {
    backgroundColor: '#008080',
    border: 'none',
  },
};

const Home = () => {
  const [typingText, setTypingText] = useState(''); // typing text is typing
  const [displayText, setDisplayText] = useState(''); // when typing is completed and showing the text in UI
  const text = "The Chatty"; 

  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  const client = useApolloClient();

  const [deleteAllData] = useMutation(DELETE_ALL_DATA);

  useEffect(() => {
    const typeText = async () => {
      for (let i = 0; i < text.length; i++) {
        setTypingText((prevText) => prevText + text[i]);
        await new Promise((resolve) => setTimeout(resolve, 300)); // added one letter each every 300ms
      }
      setDisplayText(text); 
    };
    typeText();
  }, [text]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await deleteAllData();
        client.resetStore();
        console.log('Data deleted successfully.');
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <main>
      <p id="heading" style={styles.text}>
        {typingText}
      </p>
      <p style={styles.text}>The Chatty's chatbot is a product of innovative artificial intelligence technology, interacting with users in various fields and providing valuable conversations. This chatbot is based on the large language model ChatGPT and has great natural language processing capabilities. The The Chatty chatbot understands users' questions and requests and provides appropriate answers.</p>
      <div>
        {Auth.loggedIn() ? (
          <>
            <br></br>
            <Container className="d-flex justify-content-center">
              <Button id="startChatbutton" as={Link} variant="outline-danger" className="m-2" to="/survey">
                <span className="excited-text">
                  Hi! <span id="username">{Auth.getProfile().data.username}</span>! Do you want to start chatting?
                </span>
              </Button>
              <Button id="button" variant="outline-danger" className="m-2" onClick={logout}>
                Logout
              </Button>
            </Container>
          </>
        ) : (
          <>
            <Container className="d-flex justify-content-center">
              <Button id="button" as={Link} variant="outline-danger" className="m-2" to="/login">
                Login
              </Button>
              <Button id="button" as={Link} variant="outline-danger" className="m-2" to="/signup">
                Signup
              </Button>
            </Container>
          </>
        )}
      </div>
    </main>
  );
};

export default Home;
