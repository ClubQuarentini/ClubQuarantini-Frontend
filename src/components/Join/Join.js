import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Room from "../Room/Room";
import config from "../../config";
import SignupModal from "../SignupModal/SignupModal";
import { useSpring, animated } from "react-spring";

import "./join.css";

const generateRandomRoom = () => {
  let randomArray = [];
  while (randomArray.length != 6) {
    let randomNum = Math.floor(Math.random() * 9);
    randomArray.push(randomNum);
  }
  return randomArray.join("").toString();
};

const Join = () => {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [token, setToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const fade = useSpring({
    config: { duration: 2000 },
    from: { opacity: 0 },
    delay: 1000,
    opacity: 1,
  });

  const EnterClubRoom = useCallback(
    async (event) => {
      event.preventDefault();
      setIsModalOpen(false);

      const tokenData = await fetch(`${config.API_URI}/video/token`, {
        method: "POST",
        body: JSON.stringify({
          identity: username,
          room: roomName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      //checking to see if there is a room and if there is any people in that room
      //checks for same username inside room
      const roomInfo = await fetch(`${config.API_URI}/rooms/${roomName}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setError(null);
          if (data.length > 0) {
            let participantCheck = new Promise((resolve, reject) => {
              data.forEach((participant) => {
                if (participant.identity === username) {
                  reject();
                }
              });
              resolve();
            })
              .then(() => {
                setToken(tokenData.token);
              })
              .catch(() => {
                setError("Username is taken");
              });
          } else {
            setError("Room not found");
          }
        });
    },
    [username, roomName]
  );

  const CreateClubRoom = useCallback(
    async (event) => {
      event.preventDefault();
      setIsModalOpen(false);
      let roomID = generateRandomRoom();
      setRoomName(roomID);
      const data = await fetch(`${config.API_URI}/video/token`, {
        method: "POST",
        body: JSON.stringify({
          identity: username,
          room: roomName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      console.log("username", username);
      setToken(data.token);
      setError(null);
    },
    [username, roomName]
  );

  if (token) {
    return (
      <Room
        userName={username}
        roomName={roomName}
        token={token}
        setToken={setToken}
      />
    );
  } else {
    return (
      <div className="joinOuterContainer">
        <div className="overlay">
          <img className="logo" src="../../logo.png"></img>
          <animated.div className="joinInnerContainer" style={fade}>
            <div className="tagline-container">
              <div className="NO-taglines">
                <h2>NO COVER</h2>
                <h2>NO BOUNCERS</h2>
                <h2>NO PROBLEMS</h2>
              </div>
              <h1 className="heading">THEQUARANTINI.CLUB</h1>
              <p className="tagline">
                Never been easier to connect with your friends over a quick,
                virtual drink.
              </p>
            </div>
            {error && <p className="username-error">{error}</p>}
            <form onSubmit={EnterClubRoom}>
              <div className="input-container">
                <input
                  className="joinInput"
                  type="text"
                  placeholder="Create username"
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  required
                />
                <input
                  className="joinInput"
                  type="text"
                  placeholder="Enter group code"
                  onChange={(e) => setRoomName(e.target.value.toString())}
                  req
                />
                <button type="submit" className="button">
                  HIT THE CLUB
                </button>
              </div>
            </form>
            <button
              onClick={() => setIsModalOpen(true)}
              className="create-club"
            >
              Or start your own club
            </button>
            <SignupModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              handleSubmit={CreateClubRoom}
              setUsername={setUsername}
              setRoomName={setRoomName}
            />
          </animated.div>
        </div>
      </div>
    );
  }
};
export default Join;
