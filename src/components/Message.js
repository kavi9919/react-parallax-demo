// Message.js
import React from "react";

const Message = ({ message }) => {
  return (
    <div className={`message ${message.user}`}>
      <p>{message.text}</p>
    </div>
  );
};

export default Message;
