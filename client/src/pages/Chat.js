import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';


import { QUERY_USER, QUERY_ME } from '../utils/queries';
import '../styles/chat.css';
import Auth from '../utils/auth';

const usertype = localStorage.getItem('selectedType');


const Chat = () => {

    const logout = (event) => {
        event.preventDefault();
        Auth.logout();
    };

    const [chatState, setChatState] = useState({
        chat: ''
    });

    const { username: userParam } = useParams();

    const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
        variables: { username: userParam }
    });

    const handlechatChange = (event) => {
        event.preventDefault();
        setChatState(event.target.value);
    };

    const handleChatSubmit = async (event) => {
        event.preventDefault();
        console.log(chatState);
        const { Configuration, OpenAIApi } = require("openai");
        const configuration = new Configuration({
            apiKey: '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',
        });
        const openai = new OpenAIApi(configuration);
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role:"system", content: "You are a lovely girlfriend talking to boyfriend" },
                {
                    role: "user", content: "i love you?"
                },
            ],
        });
        console.log(completion.data.choices[0].message.content);


    };

    const user = data?.me || data?.user || {};

    // navigate to personal profile page if username is yours
    if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
        return <Navigate to="/chat" />;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user?.username) {
        return (
            <h4>
                You need to be logged in to see this. Use the navigation links above to sign up or log in!
            </h4>
        );
    }

    return (
        <>
            <h1>This is the chat part</h1>
            <div>
                <div id="chatwindow">
                
                </div>
                <Form onSubmit={handleChatSubmit} className="my-3">
                    <Form.Group className="mb-3" controlId="Username">
                        <Form.Control
                            type="text"
                            placeholder="Send a message"
                            onChange={handlechatChange}
                            value={chatState.chat}
                            name="chat"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                <Container className="d-flex justify-content-center">
                    <Button as={Link} variant="info" className="m-2" to="/chat">
                        Save chat
                    </Button>
                    <Button as={Link} variant="info" className="m-2" onClick={logout} to="/">
                        Finish chat
                    </Button>
                </Container>
            </div>
        </>
    );
};

export default Chat;
