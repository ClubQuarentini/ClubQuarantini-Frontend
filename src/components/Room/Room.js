import React, { useState, useEffect, useCallback } from "react";
import Video from "twilio-video";
import Participant from "../Participant/Participant";
import Bar from "../Bar/Bar";
import config from "../../config";
import io from "socket.io-client";
import "./room.css";
let socket;

const Room = ({ userName, roomName, token, setToken }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [drinkOrders, setDrinkOrders] = useState([]);
  const [drinkOrder, setDrinkOrder] = useState([]);

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  useEffect(() => {
    socket = io(config.API_URI);
    socket.emit("join", { userName, roomName }, () => {});
    return () => {
      socket.emit("disconnectWhenLoggingOut");
      socket.off();
    };
  }, []);

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

  useEffect(() => {
    socket.on("allDrinkOrders", ({ userOrders }) => {
      console.log("orders", userOrders);
      setDrinkOrders(userOrders);
      // console.log("orders", drinkOrders);
    });

    socket.on("newOrder", ({ newOrder }) => {
      console.log("single order", newOrder);
      setDrinkOrder(newOrder);
    });
  }, [drinkOrder, drinkOrders]);

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
      // console.log("this is the participants", participants);
    };
    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    Video.connect(token, {
      name: roomName,
    }).then((room) => {
      setRoom(room);
      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      room.participants.forEach(participantConnected);
    });
    //this is for disconnecting
    return () => {
      setRoom((currentRoom) => {
        if (currentRoom && currentRoom.localParticipant.state === "connected") {
          currentRoom.localParticipant.tracks.forEach(function (
            trackPublication
          ) {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token]);

  const sendDrinkOrderToServer = (e, { userName, roomName, drinkID }) => {
    e.preventDefault();
    socket.emit("drinkOrder", { userName, roomName, drinkID });
  };

  const handleLogout = useCallback((event) => {
    setToken(null);
  }, []);

  return (
    <div className="room">
      <button className="logout" onClick={handleLogout}>
        Log out
      </button>
      <div className="room-header">
        <img src="../../../logo.png" />
        <div className="room-info">
          <h2>Club ID: {roomName}</h2>
          <h2>Occupancy: {participants.length + 1}</h2>
        </div>
      </div>
      <div className="bar-container">
        <Bar
          userName={userName}
          roomName={roomName}
          sendDrinkOrderToServer={sendDrinkOrderToServer}
          drinkOrders={drinkOrders}
        />
        <div className="local-participant">
          {room ? (
            <Participant
              key={room.localParticipant.sid}
              participant={room.localParticipant}
            />
          ) : (
            ""
          )}
        </div>

        <div className="remote-participants">{remoteParticipants}</div>
      </div>
    </div>
  );
};

export default Room;
