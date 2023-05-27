import React from 'react';

const styles = {
    font : {
      color: 'white',
      fontSize:'20px'
    }
}

const ChatList = ({ chats, title }) => {
  if (!chats.length) {
    return <h3> </h3>;
  }

  return (
    <div style ={styles.font}>
      <h3>{title}</h3>
      {chats &&
        chats.map((chat) => (
          <div key={chat._id} className="mb-3">
            <p className="p-2 m-0">
              {chat.chat} 
              <span style={{ fontSize: '1rem', float:'right'}}>
              {chat.createdAt}
              </span>
            </p>
          </div>
        ))}
    </div>
  );
};

export default ChatList;
