import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import { QUERY_USER, QUERY_ME, QUERY_CHAT, QUERY_ANSWER,QUERY_CONVERSATION } from '../utils/queries';

import Auth from '../utils/auth';

const Profile = () => {
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const { loading: chatloading, data: chatdata } = useQuery(QUERY_CHAT);
  const chats = chatdata?.chat || [];
  console.log(chats);

  const { loading: answerloading, data: answerdata } = useQuery(QUERY_ANSWER);
  const answers = answerdata?.answer || [];
  console.log(answers);

 const { loading: conversationloading, data: conversationdata } = useQuery(QUERY_CONVERSATION);

 
 const conversation = conversationdata;
 console.log(conversation);



  const user = data?.me || data?.user || {};

  // navigate to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/me" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  return (
    <Card style={{ width: '100%' }}>
      <Card.Header>User Details</Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>Id: {user._id}</ListGroup.Item>
        <ListGroup.Item>Email: {user.email}</ListGroup.Item>
        <ListGroup.Item>Username: {user.username}</ListGroup.Item>
        <ListGroup.Item>
          Conversations:
          <ul>
            {chats.map((chat, index) => (
              <li key={chat._id}>
                <strong>Chat:</strong> {chat.chat}
                <br />
                <strong>Answer:</strong> {answers[index]?.answer}
              </li>
            ))}
          </ul>
        </ListGroup.Item>
        
      </ListGroup>
    </Card>
  );
};

export default Profile;