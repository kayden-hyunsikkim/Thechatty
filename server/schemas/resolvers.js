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
      //console.log(chatResult);

      //await Answer.deleteMany(); // --> delete all old answer data first (this should be deleted)
      const Aianswer = await Answer.create({ answer: chatResult }); // --> creat a new answer data from Ai
      console.log(Aianswer);


      return Aianswer;

    },

    addConversation: async (parent, { chat, answer }) => {

      const userconversation = await Conversation.create({ chat, answer }); // --> creat a new chat data
      console.log(`this is created conversation ${userconversation}`);
      return userconversation;
    },


    deleteAllData: async () => {

      try {
        await Chat.deleteMany(); // 이 부분에서 await 키워드를 사용하여 Promise가 처리될 때까지 대기합니다.
        await Answer.deleteMany(); // 이 부분에서도 await 키워드를 사용합니다.
        
        return true; // 데이터 삭제가 성공했을 경우 true를 반환합니다.
      } catch (error) {
        console.error(error);
        return false; // 데이터 삭제가 실패했을 경우 false를 반환합니다.
      }
    },
  },
};

module.exports = resolvers;
