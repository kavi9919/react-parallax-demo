// Chatbot.js
import React, { useState, useEffect } from "react";
import "../chat.css"; // Import CSS file for styling
import { FiSend } from "react-icons/fi";
import topScreen from "../images/top-screen.png";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderContact, setLeaderContact] = useState('');
  const [memberCount, setMemberCount] = useState(0);
  const [members, setMembers] = useState([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (!storedName) {
      appendMessage("bot", "Hi there! What's your team name?");
    } else {
      localStorage.clear();
      appendMessage("bot", `Welcome back, ${storedName}! Please enter your name.`);
    }
  }, []);

  const appendMessage = (sender, message) => {
    setMessages(prevMessages => [...prevMessages, { sender, message }]);
  };

  const sendMessage = () => {
    const userInput = document.getElementById("userInput").value.trim();
    if (userInput === "") return;
  
    appendMessage("user", userInput); // Add this line to append user input to chat logs
  
    if (userInput.toLowerCase() === "restart") {
      localStorage.clear();
      setMessages([]);
      appendMessage("bot", "Hi there! What's your team name?");
      document.getElementById("userInput").value = "";
        setStep(0);
        setTeamName('');
        setLeaderName('');
        setLeaderEmail('');
        setLeaderContact('');
        setMemberCount(0);
        setMembers([]);
      return;
    }

    switch (step) {
      case 0: // Asking for team name
        if (!localStorage.name) {
          localStorage.name = userInput;
          setTeamName(userInput);
          appendMessage("bot", `Great! Now, please enter the name of the leader.`);
          setStep(step + 1);
        }
        break; // Added break statement
      case 1: // Asking for leader name
        setLeaderName(userInput);
        setStep(step + 1);
        appendMessage("bot", `Hello ${userInput}! Please enter your email address.`);
        break;
      case 2: // Asking for leader email
        if (!validateEmail(userInput)) {
          appendMessage("bot", "Oops! Invalid email address. Please enter a valid email.");
        } else {
          setLeaderEmail(userInput);
          setStep(step + 1);
          appendMessage("bot", "Thank you! Now, please enter your contact number.");
        }
        break;
      case 3: // Asking for leader contact number
        if (!validatePhoneNumber(userInput)) {
          appendMessage("bot", "Oops! Invalid phone number. Please enter a valid phone number in +94XXXXXXXXX format.");
        } else {
          setLeaderContact(userInput);
          setStep(step + 1);
          appendMessage("bot", "How many members does your team consist of (2-3)?");
        }
        break;
      case 4: // Asking for team member count
        const memberCount = parseInt(userInput);
        if (memberCount < 2 || memberCount > 3 || isNaN(memberCount)) {
          appendMessage("bot", "Oops! Team should consist of 2-3 members. Please enter a valid number.");
        } else {
          setMemberCount(memberCount);
          setStep(step + 1);
          appendMessage("bot", "Please enter the details of each team member (name, email, and contact number), separated by commas.");
        }
        break;
      case 5: // Collecting team member details
        const memberDetails = userInput.split(',').map(item => item.trim());
        if (memberDetails.length !== 3) {
          appendMessage("bot", "Oops! Please provide all the details (name, email, and contact number) separated by commas.");
        } else {
          // Assuming memberDetails is an array with [name, email, contactNumber]
          const [name, email, contactNumber] = memberDetails;
          setMembers(prevMembers => [...prevMembers, { name, email, contactNumber }]);
          if (members.length < memberCount - 1) {
            appendMessage("bot", "Please enter the details for the next team member.");
          } else {
            setStep(step + 1);
            appendMessage("bot", "Thank you! All team member details have been collected.");
          }
        }
        break;
      default:
        appendMessage("bot", "I'm sorry, I didn't understand that. Please enter a valid input.");
        break;
    }
  
    document.getElementById("userInput").value = "";
};

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phonePattern = /^\+94\d{9}$/;
    return phonePattern.test(phoneNumber);
  };

  return (
    <div className="register-screen">
      <div className="chatbox">
        <img src={topScreen} alt="Chatbot" />
        <div className="chatlogs">
          {messages.map((message, index) => (
            <div key={index} className={message.sender === "user" ? "user-message" : "bot-message"}>
              <p>{message.message}</p>
            </div>
          ))}
        </div>
        <div className="chat-form">
          <input type="text" id="userInput" placeholder="Type your message..." />
          <button onClick={sendMessage}><FiSend /></button>
        </div>
      </div>
      {/* <div className="user-info">
        <h2>User Info</h2>
        <p>Team Name: {teamName}</p>
        <p>Leader Name: {leaderName}</p>
        <p>Leader Email: {leaderEmail}</p>
        <p>Leader Contact: {leaderContact}</p>
        <p>Member Count: {memberCount}</p>
        <p>Members: {members.map((member, index) => (
          <p key={index}>{member.name}, {member.email}, {member.contactNumber}</p>
        ))}</p>
      </div> */}
    </div>
  );
};

export default Chatbot;
