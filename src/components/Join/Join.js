import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./join.css";

const Join = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div className="joinOuterContainer">
      <div className="overlay">
        <img className="logo" src="../../logo.png"></img>
        <div className="joinInnerContainer">
          <div className="tagline-container">
            <div className="NO-taglines">
              <h2>No COVER</h2>
              <h2>NO BOUNCERS</h2>
              <h2>NO PROBLEMS</h2>
            </div>
            <h1 className="heading">THEQUARANTINI.CLUB</h1>
            <p className="tagline">
              Never been easier to connect with your friends over a quick drink.
            </p>
          </div>
          <div className="input-container">
            <input
              className="joinInput"
              type="text"
              placeholder="Create username"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="joinInput"
              type="text"
              placeholder="Enter group code"
              onChange={(e) => setRoom(e.target.value)}
            />
            <Link
              onClick={(e) => (!name || !room ? e.preventDefault() : null)}
              to={`/chat?name=${name}&room=${room}`}
            >
              <button type="submit" className="button">
                HIT THE CLUB
              </button>
            </Link>
          </div>
          <button className="create-club">Or start your own club</button>
        </div>
      </div>
    </div>
  );
};

export default Join;
