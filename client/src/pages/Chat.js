import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';

import { ADD_CHAT, ADD_GENERATEAI, ADD_CONVERSATION } from '../utils/mutations';
import { QUERY_USER, QUERY_ME, QUERY_TYPE, QUERY_CHAT, QUERY_ANSWER } from '../utils/queries';

import '../styles/pages.css';
import ChatList from '../components/Chatlist';
import AnswerList from '../components/Answerlist';
import Auth from '../utils/auth';


// ============== voice recognition =============================
//const voiceRecognition = () => {
//    const SpeechRecognition = window.webkitSpeechRecognition;
//    const recognition = new SpeechRecognition();
//    const textbox = document.querySelector('#chatwindow');
//    const instructions = document.querySelector('#instruction');
//    const voiceBtn = document.querySelector('#recognition');
//
//    recognition.continuous = true;
//
//    voiceBtn.addEventListener('click', function () {
//        console.log('voice recognition')
//
//        instructions.innerHTML = "voice recognition";
//    });
//
//}

// ==============================================================

const Chat = () => {

    
    const [isLoading, setLoading] = useState(false); // loading for sendspinner
    const [chatLoading, setchatLoading] = useState(false); // loading for spinner
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
        //console.log(chatState);
    };

    const handleChatSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // make the send spinner work
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

        

        } catch (err) {
            console.error(err);
        }

    };

    const [addConversation, { error: conversationError }] = useMutation(ADD_CONVERSATION);

    const saveConversation = async () => {
        const parsedchatData = JSON.parse(localStorage.getItem('chatlog'));
        const newChatArray = parsedchatData.map((data) => data.chat);
        console.log(newChatArray);

        const parsedanswerData = JSON.parse(localStorage.getItem('answerlog'));
        const newanswerArray = parsedanswerData.map((data) => data.answer);
        console.log(newanswerArray);

        setchatLoading(true);

        try {
            for (let i = 0; i < newChatArray.length; i++) {
                await addConversation({
                    variables: {
                        chat: newChatArray[i],
                        answer: parsedanswerData[i].answer,
                        user_id: user._id, // 사용자 ID 추가
                    },
                });

                setchatLoading(false);

                console.log('Conversation saved successfully!');
                // Additional tasks to perform here
            }

        } catch (error) {
            console.error('Failed to save conversation:', error);
        }
    };

    // 프로필 버튼을 클릭했을 때 saveConversation 함수 호출
    const handleProfileButtonClick = () => {
        saveConversation();
    };



    const { loading: chatloading, data: chatdata } = useQuery(QUERY_CHAT);
    const chats = chatdata?.chat || [];
     console.log(chats);
    //console.log(chats[0].chat)
    const chatlog = JSON.stringify(chats);
    localStorage.setItem('chatlog', chatlog);

    const { loading: answerloading, data: answerdata } = useQuery(QUERY_ANSWER);
    const answers = answerdata?.answer || [];
    console.log(answers);
    //console.log(answers[0].answer)
    const answerlog = JSON.stringify(answers);
    localStorage.setItem('answerlog', answerlog);

    const chatAreaRef = useRef(null);

    // 스크롤을 아래로 이동시키는 함수
    const scrollToBottom = () => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    };

    // 새로운 채팅이 추가될 때마다 스크롤을 아래로 이동
    useEffect(() => {
        scrollToBottom();
    }, [chats]); // chats 배열에 변화가 있을 때마다 호출되도록 설정

    // 답변이 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [answers]); // answers 배열에 변화가 있을 때마다 호출되도록 설정

    const user = data?.me || data?.user || {};
    //const userId = user._id;

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
                <Container fluid className="mt-5">
                    <Row>
                        <Col xs={12} id="chatarea" ref={chatAreaRef} >
                            {chats.map((chat, index) => (
                                <React.Fragment key={index}>
                                    <ChatList chats={[chat]} title="You" />
                                    {answers[index] && <AnswerList answers={[answers[index]]} title="Chatty" />}
                                </React.Fragment>
                            ))}
                        </Col>
                    </Row>
                </Container>



                <Form onSubmit={handleChatSubmit} className="mt-4">

                    <Form.Group className="mb-3" controlId="Username" id='formgroup'>
                        <Form.Control
                            type="text"
                            placeholder="Send a message"
                            onChange={handlechatChange}
                            value={chatState.chat}
                            name="chat"
                            autoFocus
                        />
                    </Form.Group>
                    <Button id='sendBtn' variant="warning" type="submit" className='me-3' disabled={isLoading}>
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
                            'Send✈️' // 로딩 중이 아닌 경우 텍스트 표시
                        )}

                    </Button>
                </Form>

                <Container className="d-flex justify-content-center">
                    <Button id='button' variant='outline-danger' className="m-2" onClick={handleProfileButtonClick} disabled={chatLoading}>
                    {chatLoading ? (
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
                            'save chat' // 로딩 중이 아닌 경우 텍스트 표시
                        )}
                    </Button>
                    <Button as={Link} id='button' variant='outline-danger' className="m-2" to="/me">
                        Finish chat
                    </Button>
                </Container>
            </div>

        </>
    );
};

export default Chat;