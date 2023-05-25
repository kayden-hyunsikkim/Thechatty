const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { Type } = require('../models');
const { Chat } = require('../models');
const { Answer } = require('../models');
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

      const usertype = await Type.create( { type }); // --> creat a new type data
      return  usertype ;
    },

    addChat: async (parent, { chat }) => {

      await Chat.deleteMany(); // --> delete all old chat data first (this should be deleted)
      const userchat = await Chat.create( { chat }); // --> creat a new chat data
      return  userchat ;
    },

    addAnswer: async (parent, { type, chat }) => {

      
        const apiKey = process.env.OPENAI_API_KEY;
        const configuration = new Configuration({
            apiKey: apiKey
        });
        // OpenAI API 호출
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

        // API 응답에서 대화 결과 추출
        const chatResult = completion.data.choices[0].message.content;
        console.log(chatResult);
  
        await Answer.deleteMany(); // --> delete all old answer data first (this should be deleted)
        const Aianswer = await Answer.create({ answer: chatResult }); // --> creat a new answer data from Ai
        console.log(Aianswer);
         return  Aianswer ;

     
        

    }
  },
};

module.exports = resolvers;
