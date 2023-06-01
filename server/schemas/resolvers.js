const { AuthenticationError } = require('apollo-server-express');
const { User,Type,Chat,Answer,Conversation } = require('../models');
const { signToken } = require('../utils/auth');
const { Configuration, OpenAIApi } = require("openai"); //---> this part occur proxy error


const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },
    user: async (parent, { username }) => {
      return User.findOne({ username });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    type: async () => {
      return Type.find();
    },
    chat: async () => {
      return Chat.find();
    },
    answer: async () => {
      return Answer.find();
    },
    conversation: async (parent, args, context) => {
      if (!context.user ) {
        throw new AuthenticationError('You must be logged in.');
      }
    
      // 특정 사용자 ID에 해당하는 Conversation을 가져옵니다.
      const userConversations = await Conversation.find({ user:context.user._id  });
      return userConversations;
    },
    
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },

    addType: async (parent, { type }) => {

      await Type.deleteMany(); // --> delete all old type data first

      const usertype = await Type.create({ type }); // --> creat a new type data
      return usertype;
    },

    addChat: async (parent, { chat }) => {

      //await Chat.deleteMany(); // --> delete all old chat data first (this should be deleted)
      const userchat = await Chat.create({ chat }); // --> creat a new chat data
      return userchat;
    },

    addAnswer: async (parent, { type, chat }) => {


      const apiKey = process.env.OPENAI_API_KEY;
      const configuration = new Configuration({
        apiKey: apiKey
      });
      // call OpenAI API
      const openai = new OpenAIApi(configuration);
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `${type}` },
          {
            role: "user", content: `${chat}`
          },
        ],
      });
      

      // from API
      const chatResult = completion.data.choices[0].message.content;
    
      
      const Aianswer = await Answer.create({ answer: chatResult }); // --> creat a new answer data from Ai
      console.log(Aianswer);
    
      


      return Aianswer;

    },

    addConversation: async (parent, { chat, answer, user_id },context) => {
      const userconversation = await Conversation.create({ chat, answer, user:context.user._id  });
      console.log(`This is the created conversation: ${userconversation}`);
      return userconversation;
    },
    


    deleteAllData: async () => {

      try {
        await Chat.deleteMany(); 
        await Answer.deleteMany(); 
        return true; 
      } catch (error) {
        console.error(error);
        return false; 
      }
    },
  },
};

module.exports = resolvers;
