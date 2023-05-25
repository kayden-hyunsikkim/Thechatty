import React, { useState } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ADD_TYPE } from '../utils/mutations';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Select from "react-select";

import { QUERY_USER, QUERY_ME } from '../utils/queries';

import '../styles/survey.css';
import Auth from '../utils/auth';


const Survey = () => { 
  const navigate = useNavigate()
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });


  const [selectedType, setSelectedType] = useState({type: ''}); // 선택된 옵션을 추적하는 상태

  const [addType, { typedata }] = useMutation(ADD_TYPE);

  const handleTypeChange = (event) => {
    event.preventDefault();
    const { value } = event.target;
    setSelectedType({
      ...selectedType,
      type: value,
    }); // 선택된 옵션을 상태에 업데이트
    console.log(selectedType);
  };

  const handlesurveyFormSubmit = async (event) => {
    event.preventDefault();
    console.log(selectedType);
    const { type } = selectedType;
    console.log(type);
    localStorage.setItem('selectedtype', JSON.stringify(selectedType));
    try {
      const { data } = await addType({
        variables: { type: type },
      });

    } catch (e) {
      console.error(e);
      console.log(e.message);
    }
    navigate("/chat")
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
          <Form  >
            <Form.Select aria-label="Default select example" onChange={handleTypeChange} value={selectedType.type}>
              <option>Select type which you want</option>
              <option name="ASSISTANT"value="you are a loyal assistant talking to boss" >Assistant</option>
              <option name="TEACHER" value="you are a lovely kindergarden teacher talking to student">Teacher</option>
              <option name="GIRLFRIEND" value="you are a lovely girlfriend talking to boyfriend">Girlfriend</option>
              <option name="BOYFRIEND" value="you are a lovely boyfriend talking to girlfriend">Boyfriend</option>
            </Form.Select>
            <Container className="d-flex justify-content-center">
              <Button  onClick={handlesurveyFormSubmit} variant='info' className="m-2">
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
