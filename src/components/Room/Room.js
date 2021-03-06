import React, { useState, useEffect, useCallback, PureComponent } from "react";
import Video from "twilio-video";
import Participant from "../Participant/Participant";
import Bar from "../Bar/Bar";
import config from "../../config";
import io from "socket.io-client";

import Drinks from "../../Drinks";
import "./room.css";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../Checkout/Checkout";

let socket;

// const promise = loadStripe("pk_test_1hoMMf50PMd3g4ZPW4xh1WmG00EYO0AhYn");

const Room = ({ userName, roomName, token, setToken }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [drinkOrders, setDrinkOrders] = useState([]);
  const [drinkOrder, setDrinkOrder] = useState(null);
  // const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false);

  const remoteParticipants = participants.map((participant, i) => (
    <Participant
      className={i}
      key={participant.sid}
      drink={drinkOrder}
      participant={participant}
    />
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
      // console.log("message", messages);
    });
    socket.on("roomData", ({ users }) => {
      // console.log("roomdata", users);
      setUsers(users);
    });
  }, [messages]);

  useEffect(() => {
    socket.on("allDrinkOrders", ({ userOrders }) => {
      // console.log("orders", userOrders);

      setDrinkOrders(userOrders);
      // console.log("orders", drinkOrders);
    });

    socket.on("newOrder", ({ newOrder }) => {
      setTimeout(() => {
        // console.log("single order", newOrder);
        setDrinkOrder(newOrder);
      }, 10000);
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

  const sendBartenderMakingDrink = ({ userName, roomName }) => {
    socket.emit("makingDrink", { userName, roomName });
  };

  const handleLogout = useCallback((event) => {
    setToken(null);
  }, []);

  return (
    <div className="room">
      {/* <Elements stripe={promise}>
        {isCheckoutFormOpen && (
          <CheckoutForm
            setIsCheckoutFormOpen={setIsCheckoutFormOpen}
            isCheckoutFormOpen={isCheckoutFormOpen}
          />
        )}
      </Elements> */}
      <div className="club-info">
        <button className="logout" onClick={handleLogout}>
          Log out
        </button>
        <h2>Club ID: {roomName}</h2>
      </div>
      <div className="bar-container">
        <Bar
          userName={userName}
          roomName={roomName}
          sendDrinkOrderToServer={sendDrinkOrderToServer}
          sendBartenderMakingDrink={sendBartenderMakingDrink}
          drinkOrders={drinkOrders}
          // setIsCheckoutFormOpen={setIsCheckoutFormOpen}
          // isCheckoutFormOpen={isCheckoutFormOpen}
        />
        <div className="local-participant">
          {room ? (
            <Participant
              key={room.localParticipant.sid}
              participant={room.localParticipant}
              drink={drinkOrder}
            />
          ) : (
            ""
          )}
        </div>
        {remoteParticipants}
      </div>
    </div>
  );
};

export default Room;
