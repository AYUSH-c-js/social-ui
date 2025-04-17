import React, { useEffect, useState } from "react";
import { userfollowers, sendMessage, getMessages } from "../api/auth";
import Navbar from "../components/Navbar";
import io from "socket.io-client";
import "./Chat.css";
const socket = io("http://localhost:5000", {
  transports: ['websocket'],
});



const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const currentUser = localStorage.getItem("token");

  useEffect(() => {
    document.title = "Chats";
    fetchUsers();
  
    if (currentUser) {
      socket.emit("join", currentUser);
    }
  
    const handleReceiveMessage = ({ senderId, text }) => {
      if (selectedUser && senderId === selectedUser._id) {
        setMessages((prev) => [...prev, { senderId, text }]);
      }
    };
  
    socket.on("receiveMessage", handleReceiveMessage);
  
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [currentUser, selectedUser]);
  

  const fetchUsers = async () => {
    const response = await userfollowers();
    setUsers(response.data.followers);
  };

  const fetchMessages = async (userId) => {
    try {

      const response = await getMessages(currentUser, userId);
      console.log("Fetched messages:", response.data);
      setMessages([...response.data]);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchMessages(user._id);
  };

  const handleSendMessage = async () => {
    if (!text.trim()) return;
  
    const messagePayload = {
      senderId: currentUser,
      receiverId: selectedUser._id,
      text,
    };
  
    try {
      await sendMessage(messagePayload);
      socket.emit("sendMessage", messagePayload);
  
      setMessages((prev) => [...prev, {
        ...messagePayload,
        sender: { _id: currentUser } // match message format for "isOwn"
      }]);
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="chat-container">
        <div className="chat-users">
          <h3>Followers</h3>
          {users.map((user) => (
            <div
              key={user._id}
              className={`chat-user ${selectedUser?._id === user._id ? "active" : ""}`}
              onClick={() => handleUserSelect(user)}
            >
              <img src={user.profilePicture} alt={user.username} />
              <span>{user.username}</span>
            </div>
          ))}
        </div>

        <div className="chat-box">
          {selectedUser ? (
            <>
              <div className="chat-header">
                <img src={selectedUser.profilePicture} alt="profile" />
                <h3>{selectedUser.username}</h3>
              </div>

              <div className="chat-messages">
                {messages.map((msg, index) => {
                  const isOwn =  msg?.sender?._id === currentUser;
                  return (
                    <div
                      key={index}
                      className={`chat-message ${isOwn ? "own" : "received"}`}
                    >
                      {msg.text}
                    </div>
                  );
                })}
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </>
          ) : (
            <div className="no-chat">
              <p>Select a user to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
