import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
    }
  }
`;


//------ getting type user wants from server-------------//
export const QUERY_TYPE = gql`
  query getTYPE {
    type { 
      type
    }
  }
`;

//------ getting type user wants from server-------------//
export const QUERY_CHAT = gql`
  query getCHAT {
    chat { 
      chat
      createdAt
    }
  }
`;



//------ getting type user wants from server-------------//
export const QUERY_ANSWER = gql`
  query getANSWER {
    answer { 
      answer
      createdAt
    }
  }
`;


//------ getting type user wants from server-------------//
export const QUERY_CONVERSATION = gql`
  query getCONVERSATION {
    conversation {
      _id
      chat
      answer
      createdAt
  }
}

`;
