import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Room from "../Room/Room";
import config from "../../config";
import "./join.css";

const Join = () => {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [token, setToken] = useState(null);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
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

      setToken(data.token);
    },
    [username, roomName]
  );

  const handleLogout = useCallback((event) => {
    setToken(null);
  }, []);

  if (token) {
    return (
      <Room
        userName={username}
        roomName={roomName}
        token={token}
        handleLogout={handleLogout}
      />
    );
  } else {
    return (
      <div className="joinOuterContainer">
        <div className="overlay">
          <img className="logo" src="../../logo.png"></img>
          <div className="joinInnerContainer">
            <div className="tagline-container">
              <div className="NO-taglines">
                <h2>NO COVER</h2>
                <h2>NO BOUNCERS</h2>
                <h2>NO PROBLEMS</h2>
              </div>
              <h1 className="heading">THEQUARANTINI.CLUB</h1>
              <p className="tagline">
                Never been easier to connect with your friends over a quick
                drink.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="input-container">
                <input
                  className="joinInput"
                  type="text"
                  placeholder="Create username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  className="joinInput"
                  type="text"
                  placeholder="Enter group code"
                  onChange={(e) => setRoomName(e.target.value)}
                  req
                />
                <button type="submit" className="button">
                  HIT THE CLUB
                </button>
              </div>
            </form>
            <button className="create-club">Or start your own club</button>
          </div>
        </div>
      </div>
    );
  }
};
export default Join;
