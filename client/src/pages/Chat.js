import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';

import { ADD_CHAT, ADD_GENERATEAI } from '../utils/mutations';
import { QUERY_USER, QUERY_ME, QUERY_TYPE, QUERY_CHAT, QUERY_ANSWER } from '../utils/queries';


import ChatList from '../components/Chatlist';
import AnswerList from '../components/Answerlist';
import '../styles/chat.css';
import Auth from '../utils/auth';


// ============== voice recognition =============================
const voiceRecognition = () => {
    const SpeechRecognition = window.webkitSpeechRecognition;
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

// ==============================================================

const Chat = () => {

    const [isLoading, setLoading] = useState(false); // loading for spinner

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

    //this is the cache update part to render the changed chat part only first
    const [addChat, { error }] = useMutation(ADD_CHAT, {
        update(cache, { data: { addChat } }) {
            try {
                const { chat } = cache.readQuery({ query: QUERY_CHAT });

                cache.writeQuery({
                    query: QUERY_CHAT,
                    data: { chat: [addChat, ...chat] },
                });
            } catch (e) {
                console.error(e);
            }
        },
    });


    //this is the cache update part to render the changed answer part only first
    const [addAnswer, { error: answererror }] = useMutation(ADD_GENERATEAI, {
        update(cache, { data: { addAnswer } }) {
            try {
                const { answer } = cache.readQuery({ query: QUERY_ANSWER });

                cache.writeQuery({
                    query: QUERY_ANSWER,
                    data: { answer: [addAnswer, ...answer] }, // 수정: data 객체에 answer 필드 추가
                });
            } catch (e) {
                console.error(e);
            }
        },
    });

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
        setLoading(true); // make the spinner work
        console.log(chatState);
        const { chat } = chatState;
        console.log(chat);
        try {
            await addChat({
                variables: { chat: chat },
            });

            await addAnswer({
                variables: {
                    type: type.type[0].type, // added the type(only string) user selected
                    chat: chat
                },
            })

            setChatState({ chat: '' });

            await setLoading(false)

            //await window.location.reload(); // page reload when get a answer from openAI


        } catch (err) {
            console.error(err);
        }



    };


    const { loading: chatloading, data: chatdata, refetch: refetchChats } = useQuery(QUERY_CHAT);
    const chats = chatdata?.chat || [];
    console.log(chats);

    const { loading: answerloading, data: answerdata, refetch: refetchAnswers } = useQuery(QUERY_ANSWER);
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

    if (loading || answerloading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div>
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            {chats.map((chat, index) => (
                                <React.Fragment key={index}>
                                    <ChatList chats={[chat]} title="Chat~~" />
                                    {answers[index] && (
                                        <AnswerList answers={[answers[index]]} title="Answer~~" />
                                    )}
                                </React.Fragment>
                            ))}
                        </Col>
                    </Row>
                </Container>



                <Form onSubmit={handleChatSubmit} className="my-3">
                    <Form.Group className="mb-3" controlId="Username">
                        <Form.Control
                            type="text"
                            placeholder="Send a message"
                            onChange={handlechatChange}
                            value={chatState.chat}
                            name="chat"
                            autoFocus
                        />
                    </Form.Group>
                    <Button id='openai' variant="primary" type="submit" className='me-3' disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                <span className="ms-1">Loading...</span>
                            </>
                        ) : (
                            'OpenAI' // 로딩 중이 아닌 경우 텍스트 표시
                        )}

                    </Button>
                </Form>

                <Container className="d-flex justify-content-center">
                    <Button as={Link} variant="info" className="m-2" to="/chat" >
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
