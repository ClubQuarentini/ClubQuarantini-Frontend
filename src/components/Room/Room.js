import React, { useState, useEffect } from "react";
import Video from "twilio-video";
import Participant from "../Participant/Participant";
import Bar from "../Bar/Bar";
import "./room.css";

const Room = ({ roomName, token, handleLogout }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
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

  return (
    <div className="room">
      <button className="logout" onClick={handleLogout}>
        Log out
      </button>
      <div className="room-header">
        <img src="../../../logo.png" />
        <div className="room-info">
          <h2>Club ID: {roomName}</h2>
          <h2>Occupancy: {participants.length}</h2>
        </div>
      </div>
      <div className="bar-container">
        <Bar />
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
