import React, { useEffect, useRef, useState } from "react";
import "../css/MeetingPage.css";
export default function Streams({ stream }) {
  const ref = useRef(null);
 const [videoMuteStatus,setvideoMuteStatus] = useState(null);

  useEffect(() => {
    ref.current.srcObject = stream.mediaStream;
    console.log(stream,"check vide mute status");
    setvideoMuteStatus (stream.video);
  }, [stream]);
  return (
    <div className="videos">
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
