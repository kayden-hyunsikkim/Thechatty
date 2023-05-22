import React, { useState} from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ADD_TYPE } from '../utils/mutations';
import { useQuery } from '@apollo/client';
import { Link} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


import { QUERY_USER, QUERY_ME } from '../utils/queries';

import '../styles/survey.css';
import Auth from '../utils/auth';


const Survey = () => {
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const [selectedType, setSelectedType] = useState(); // 선택된 옵션을 추적하는 상태
  const [addType] = useMutation(ADD_TYPE);

  const handleTypeChange = (event) => {
    event.preventDefault();
    setSelectedType(event.target.value); // 선택된 옵션을 상태에 업데이트
    console.log(selectedType);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(selectedType);
    localStorage.setItem('selectedtype', selectedType);
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
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  return (
    <>
      <h1>Please choose the coversation style of chatty !!</h1>
      <div>
        <div id='surveyform'>
          <p>Type</p>
          <Form onClick={handleFormSubmit} >
            <Form.Select aria-label="Default select example" value={selectedType} onChange={handleTypeChange}>
              <option>Select type which you want</option>
              <option value="assistant">Assistant</option>
              <option value="teacher">Teacher</option>
              <option value="girlfriend">Girlfriend</option>
              <option value="boyfriend">Boyfriend</option>
            </Form.Select>
            <Container className="d-flex justify-content-center">
              <Button as={Link} variant='info' className="m-2" to="/chat">
                Go to chat
              </Button>
            </Container>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Survey;
