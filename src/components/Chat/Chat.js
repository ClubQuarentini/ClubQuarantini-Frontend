import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./chat.css";
import InfoBar from "../Infobar/Infobar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import UserContainer from "../Users/UsersContainer";
let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);

  // const ENDPOINT = "https://thequarentiniclub.herokuapp.com/";
  const ENDPOINT = "localhost:5000";
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    setName(name);
    setRoom(room);

    socket = io(ENDPOINT);
    socket.emit("join", { name, room }, () => {});
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
      console.log("message", messages);
    });
    socket.on("roomData", ({ users }) => {
      console.log("roomdata", users);
      setUsers(users);
    });
  }, [messages]);

  //function for sending massages

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => {
        setMessage("");
      });
    }

    console.log("messaages", message, messages);
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <UserContainer users={users} />
    </div>
  );
};

export default Chat;
