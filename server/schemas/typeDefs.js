const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Type {
    _id: ID
    type: String
  }

  type Chat {
    _id: ID
    chat: String
    createdAt: String
  }

  type Answer {
    _id: ID
    type: String
    chat: String
    answer: String
    createdAt: String
  }

  type DeletionResult {
    success: Boolean
    message: String
  }


  type Query {
    users: [User]
    user(username: String!): User
    me: User
    type: [Type]
    chat: [Chat]
    answer: [Answer]
  }


  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addType(type: String!): Type
    addChat(chat: String!): Chat
    addAnswer (type: String!, chat: String!): Answer
    deleteAllData: DeletionResult
  }
`;

module.exports = typeDefs;
