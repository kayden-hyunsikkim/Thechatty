import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import { QUERY_USER, QUERY_ME, QUERY_CHAT, QUERY_ANSWER, QUERY_CONVERSATION } from '../utils/queries';

import '../styles/pages.css';
import Auth from '../utils/auth';

const Profile = () => {
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });


  const { loading: conversationloading, data: conversationdata } = useQuery(QUERY_CONVERSATION);
  const conversations = conversationdata?.conversation || [];
  console.log(conversations);


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
    <Card style={{ width: '100%'}}>
      <Card.Header style={{ backgroundColor: 'orange' }}>User Details & Saved Chat list</Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>Username: {user.username}</ListGroup.Item>
        <ListGroup.Item>Email: {user.email}</ListGroup.Item>
        <ListGroup.Item>
          Conversations:
          <ul id='savedchat'>
            {conversations.map((item, index) => (
              <li key={item._id}>
                <div className="conversation-item">
                  <strong>created at :</strong> {item.createdAt}
                  <br />
                  <strong>you said :</strong> {item.chat}
                  <br />
                  <strong>Chatty said :</strong> {item.answer}
                </div>
                {index !== conversations.length - 1 && <hr className="conversation-divider" />} {/* 마지막 아이템이 아닌 경우에만 구분선 표시 */}
              </li>
            ))}
          </ul>
        </ListGroup.Item>

      </ListGroup>
    </Card>
  );
};

export default Profile;