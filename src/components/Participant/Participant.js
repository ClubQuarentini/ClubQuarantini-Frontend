import React, { useState, useEffect, useRef } from "react";
import "./participant.css";
import Drinks from "../../Drinks";
const Participant = ({ participant, drink }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [displayDrink, setDisplayDrink] = useState([]);

  // console.log("participantn", participant);
  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    const trackSubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  useEffect(() => {
    // console.log("this is the username and user drink", userName, drink.name);
    if (drink && participant.identity === drink.name) {
      let filteredDrink = Drinks.filter((drinkObj) => {
        return drinkObj.name === drink.drinkID;
      });
      setDisplayDrink(filteredDrink);
    }
  }, [drink]);

  return (
    <div className="participant">
      <div className="user-video-container">
        {displayDrink.length > 0 && (
          <img src={displayDrink[0].img} alt="drink" />
        )}
        <div className="video-overlay">
          <h3 className="name">{participant.identity}</h3>
        </div>
        <video className="user-video" ref={videoRef} autoPlay={true} />
      </div>
      <audio ref={audioRef} autoPlay={true} />
    </div>
  );
};

export default Participant;
