import React, { useEffect, useRef, useState } from "react";
import "../css/MeetingPage.css";
export default function Streams({ currentPin, stream, setCurrentPin }) {
  const ref = useRef(null);
  const [videoMuteStatus, setvideoMuteStatus] = useState(null);
  const [pinStatus, setPinStatus] = useState(true);
  useEffect(() => {
    ref.current.srcObject = stream.mediaStream;
    // console.log(stream.streamInfo.mediaSource.videoSourceInfo.name,"check stream info for rendering" );
    setvideoMuteStatus(stream.video);
  }, [stream]);
  const handlePinChange = (e) => {
    if (pinStatus === true) {
      setCurrentPin(stream.streamId);
      setPinStatus(false)
    }
    if(pinStatus === false) {
      setCurrentPin(null);
      setPinStatus(true)
    }

  };
  return (
    <div
      className={`videos ${
        currentPin === stream.streamId
          ? "OT_mirrored OT_root OT_publisher OT_fit-mode-cover ot-layout OT_big"
          : ""
      } `}
    >
      <button className="video-pin" onClick={handlePinChange}>
        <i class="fa-solid fa-thumbtack"></i>
      </button>
      <video
        className="videos-player"
        ref={ref}
        autoPlay
        width="100%"
        height="100%"
      ></video>
      {videoMuteStatus === "inactive" && (
        <img
          className="videos-player"
          src="/cameraoff.png"
          width="100%"
          height="100%"
        ></img>
      )}
    </div>
  );
}
