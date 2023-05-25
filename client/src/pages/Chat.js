import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { ADD_CHAT,ADD_GENERATEAI} from '../utils/mutations';
import { QUERY_USER, QUERY_ME, QUERY_TYPE, QUERY_CHAT,QUERY_ANSWER } from '../utils/queries';


import ChatList from '../components/Chatlist';
import AnswerList from '../components/Answerlist';
import '../styles/chat.css';
import Auth from '../utils/auth';

let content = '';

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

const voiceRecognition = () => {
    const SpeechRecognition = window.webkitSpeechRecognition; // SpeechRecognition 객체 참조
    const recognition = new SpeechRecognition();
    const textbox = document.querySelector('#chatwindow');
    const instructions = document.querySelector('#instruction');
    const voiceBtn = document.querySelector('#recognition');

    recognition.continuous = true;

    voiceBtn.addEventListener('click', function () {
        console.log('voice recognition')

        instructions.innerHTML = "voice recognition";
    });

}



const usertype = localStorage.getItem('selectedType');


const Chat = () => {
    const logout = (event) => {
        event.preventDefault();
        Auth.logout();
    };


    const { username: userParam } = useParams();

    const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
        variables: { username: userParam }
    });


    const { loading: typeloading, data: typedata } = useQuery(QUERY_TYPE);
    const type = typedata;
    console.log(type);

    const [addChat] = useMutation(ADD_CHAT);
    const [addAnswer] = useMutation(ADD_GENERATEAI);


    const [chatState, setChatState] = useState({
        chat: ''
    });

    const handlechatChange = (event) => {
        event.preventDefault();
        const { value } = event.target;
        setChatState({ ...chatState, chat: value, });
        console.log(chatState);
    };

    const handleChatSubmit = async (event) => {
        event.preventDefault();
        console.log(chatState);
        const { chat } = chatState;
        console.log(chat);
        try {
            const { data } = await addChat({
                variables: { chat: chat },
            });

            //window.location.reload(); // page reload


            const { data : generateAI } = await addAnswer({
                variables: { 
                    type: type.type[0].type, // added the type(only string) user selected
                    chat: chat },
            });


        } catch (err) {
            console.error(err);
        }

    };

    
    const { loading: chatloading, data: chatdata } = useQuery(QUERY_CHAT);
    const chats = chatdata?.chat || [];
    console.log(chats);

    const { loading: answerloading, data: answerdata } = useQuery(QUERY_ANSWER);
    const answers = answerdata?.answer || [];
    console.log(answers);

    

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
            <div>
                <ChatList
                    chats={chats}
                    title="Chat~~"
                />
                <AnswerList
                    answers={answers}
                    title="Answer~~"
                />
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
                    <Button id='openai' variant="primary" type="submit" className='me-3'>
                        open AI
                    </Button>
                    <Button id='recognition' variant="primary" onClick={voiceRecognition} >
                        voice recognition
                    </Button>
                    <p id='instruction' className='mt-3'>Press the Start button</p>
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
