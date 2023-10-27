import React from "react";
import "../css/MeetingPage.css";
export default function FooterControls(props) {
  return (
    <div className="footer-controls">
      <button
        className={` ${
          props.audioStatus
            ? "meeting-icons control-button"
            : "meeting-icons control-button-slash"
        }`}
        onClick={(e) => {
          props.setAudioStatus((previousStatus) => !previousStatus);
        }}
      >
        {props.audioStatus === true && (
          <i className="fa-solid fa-microphone"></i>
        )}
        {props.audioStatus === false && (
          <i className="fa-solid fa-microphone-slash"></i>
        )}
      </button>
      <button
        className={` ${
          props.videoStatus
            ? "meeting-icons control-button"
            : "meeting-icons control-button-slash"
        }`}
        onClick={(e) => {
          props.setVideoStatus((previousStatus) => !previousStatus);
        }}
      >
        {props.videoStatus === true && <i className="fa-solid fa-video"></i>}
        {props.videoStatus === false && (
          <i className="fa-solid fa-video-slash"></i>
        )}
      </button>
      <button className="meeting-icons control-button">
        <i className="fa-solid fa-display"></i>
      </button>
    </div>
  );
}
