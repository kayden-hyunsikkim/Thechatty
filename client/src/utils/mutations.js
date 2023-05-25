import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;


//------ calling server with new type -------------//
export const ADD_TYPE = gql`
  mutation addType($type: String!) {
    addType(type: $type) {
        _id
        type
    }
  }
`;

//------ calling server with new chat -------------//
export const ADD_CHAT = gql`
  mutation addChat($chat: String!) {
    addChat(chat: $chat) {
        _id
        chat
    }
  }
`;


//------ calling server to operate openAI -------------//
export const ADD_GENERATEAI = gql`
  mutation addAnswer($type: String!, $chat: String!) {
    addAnswer(type: $type, chat: $chat) {
        _id
        answer
    }
  }
`;


