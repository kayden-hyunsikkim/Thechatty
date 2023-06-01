# The chatty - Chatbot with openAI


## Table of Contents

- [Description](#description)
- [Technology](#Technology)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contribution](#contribution)
- [Questions](#questions)

## Description:

TheChatty is an AI-powered chat application that allows users to have interactive conversations with an AI assistant called Chatty. Users can send messages to Chatty and receive intelligent responses based on natural language processing and machine learning algorithms. Chatty can provide answers to various questions, engage in casual conversations, and offer personalized recommendations.

<br>
4 different types of chat available such as Assistant,Teacher,Girlfriend and Boyfriend for your chatting.
<br><br>

Experience the Art of Conversation with TheChatty!
<br><br>

Engage in captivating chats with our diverse range of virtual companions:

🤖 The Assistant: Seek assistance, ask questions, and get intelligent responses powered by advanced algorithms like Jarvis of iron man.

👩‍🏫 The Teacher: Embark on an adventure guided by our lovable Kindergarten Teacher!.

💑 The Girlfriend: Dive into heartwarming conversations, share stories, and experience interactions like never before.

👨‍❤️‍👨 The Boyfriend: Connect on a deeper level, exchange thoughts, and enjoy meaningful interactions with your virtual partner.

<br><br>
Choose your preferred chat type and indulge in the ultimate chat experience with TheChatty. Unleash the power of conversation like never before!


## Technology:

Project is created with:

- MongoDB
- Express.js
- React.js
- Node.js
- JavaScript
- GraphQL API
- Apollo Server

## Installation

To run this project, install it locally using npm:

```
npm install
```

## Usage

After installing npm packages, the application will be invoked by using the following command:

```
npm run develop
```

#### Heroku Deployment

[Click me to see app!](https://thechatty.herokuapp.com/)

- Create heroku app

  ```
  heroku create
  ```

- Create database on MongoDB Atlas:

  ```
  Cluster ➡️ Collections ➡️ Create Database
  ```

- Change Heroku setting

  ```
  Config Vars ➡️ KEY: MONGODB_URI ➡️ VALUE: (from Cluster connect, change password and database name)
  Config Vars ➡️ KEY: OPENAI_API_KEY ➡️ VALUE: (personal openAI API key)
  ```

- Git push
  ```
  git push heroku main
  heroku open
  ```

#### App Screenshot

![Screenshot](./client/public/img/Screenshot%20home.png)
![Screenshot](./client/public/img/Screenshot%20survey.png)
![Screenshot](./client/public/img/Screenshot%20chat.png)
![Screenshot](./client/public/img/Screenshot%20profile.png)
<br>
This application works in mobile as well (Android and iOS) - below screenshot is for Galaxy S20
![Screenshot](./client/public/img)
<br>
⚠️ design suits for Microsoft Edge (it might be slightly different in other browsers)

## License
N/A

## Contribution

Made by Hyunsik kim

## Questions?

Please feel free to contact me if you need any further information:

- [Email](mailto:rlagustlr122@naver.com)
- [Github Profile](https://kayden-hyunsikkim.github.io/React-Portfolio/)