import React, { useEffect, useRef, useState } from "react";
import "../css/MeetingPage.css";

import FooterControls from "../component/FooterControls";
import Streams from "../component/Streams";
import { useFetcher } from "react-router-dom";

//twyng configuration
const twyng = new window.Twyng({
  clientId: "644754e83c6374bd9ba141a6",
  apiKey: "83b78e6c50f751d2c1c6e415ef752a3b7f35ff26bc44745f5d9666df56a1d141",
  iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
});
console.log(" %c twyng status", " color: #bada55", twyng);
const initLayoutContainer = window.initLayoutContainer;
window.twyng = twyng;
window.onbeforeunload = () => window.twyng.leave();

//main component
export default function MeetingPage() {
  //open tok options
  const options = {
    maxRatio: 3 / 2, // The narrowest ratio that will be used (default 2x3)
    minRatio: 9 / 16, // The widest ratio that will be used (default 16x9)
    fixedRatio: false, // If this is true then the aspect ratio of the video is maintained and minRatio and maxRatio are ignored (default false)
    fixedRatioClass: "OT_fixedRatio", // The class to add to elements that should respect their native aspect ratio
    scaleLastRow: true, // If there are less elements on the last row then we can scale them up to take up more space
    alignItems: "center", // Can be 'start', 'center' or 'end'. Determines where to place items when on a row or column that is not full
    bigClass: "OT_big", // The class to add to elements that should be sized bigger
    bigPercentage: 0.8, // The maximum percentage of space the big ones should take up
    minBigPercentage: 0, // If this is set then it will scale down the big space if there is left over whitespace down to this minimum size
    bigFixedRatio: false, // fixedRatio for the big ones
    bigScaleLastRow: true, // scale last row for the big elements
    bigAlignItems: "center", // How to align the big items
    smallAlignItems: "center", // How to align the small row or column of items if there is a big one
    maxWidth: Infinity, // The maximum width of the elements
    maxHeight: Infinity, // The maximum height of the elements
    smallMaxWidth: Infinity, // The maximum width of the small elements
    smallMaxHeight: Infinity, // The maximum height of the small elements
    bigMaxWidth: Infinity, // The maximum width of the big elements
    bigMaxHeight: Infinity, // The maximum height of the big elements
    bigMaxRatio: 3 / 2, // The narrowest ratio to use for the big elements (default 2x3)
    bigMinRatio: 9 / 16, // The widest ratio to use for the big elements (default 16x9)

    bigFirst: true, // Whether to place the big one in the top left (true) or bottom right (false).
    // You can also pass 'column' or 'row' to change whether big is first when you are in a row (bottom) or a column (right) layout
    animate: true, // Whether you want to animate the transitions using jQuery (not recommended, use CSS transitions instead)
    window: window, // Lets you pass in your own window object which should be the same window that the element is in
    ignoreClass: "OT_ignore", // Elements with this class will be ignored and not positioned. This lets you do things like picture-in-picture
    onLayout: null, // A function that gets called every time an element is moved or resized, (element, { left, top, width, height }) => {}
  };

  const [streams, setStreams] = useState([]);
  // const [shareButtonStatus, setShareButtonStatus] = useState(false);
  const [audioStatus, setAudioStatus] = useState(true);
  const [videoStatus, setVideoStatus] = useState(true);
  const [userId, setUserId] = useState();
  const [publishStreamId, setPublishStreamId] = useState();
  const [publishStream, setPublishStream] = useState();
  const [publishScreenShare, setPublishScreenShare] = useState();
  const [screenShareStatus, setScreenShareStatus] = useState(false);
  const [currentPin, setCurrentPin] = useState();
  const refLayout = useRef(null);

  // open tok layout container
  useEffect(() => {
    if (document.getElementById("main-screen")) {
      refLayout.current = initLayoutContainer(
        document.getElementById("main-screen"),
        options
      ).layout;
    }
  }, []);

  //open tok layout function
  useEffect(() => {
    if (refLayout.current) {
      refLayout.current();
    }
  }, [streams]);

  //window resize
  useEffect(() => {
    let flag = null;
    const handleWindowResize = async () => {
      if (refLayout.current) {
        flag = setTimeout(() => {
          refLayout.current();
        }, "300");
      }
    };
    window.addEventListener("resize", handleWindowResize);
    return () => {
      clearTimeout(flag);
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  //twyng Join and publish events
  const twyngJoin = async () => {
    const randomNumber =
      Math.floor(Math.random() * (100000 - 10000 + 1)) + 1000;
    const joinInfo = {
      roomId: "RoomA3",
      userId: randomNumber.toString() + "-" + Date.now(),
      name: "name",
      attributes: {
        name: "username",
      },
    };
    // console.log("data for twyng Join", joinInfo);
    let result = await twyng.join(joinInfo);
    // console.log("twyng joined details", result.result.streams);

    //subsribe for alredy logged in users
    if (result) {
      result.result.streams.forEach(async (stream) => {
        let subscription = await twyng.subscribe(stream);
        if (
          subscription.streamInfo.mediaSource.videoSourceInfo.name === "screen"
        ) {
          setCurrentPin(subscription.streamId);
        }
        setStreams((ps) => [
          ...ps,
          {
            ...subscription,
          },
        ]);
        let flag = null;
        flag = setTimeout(() => {
          refLayout.current();
        }, "300");
      });

      const localstream = await twyng.createMediastream({
        video: {
          source: "camera",
          resolution: {
            width: 640,
            height: 360,
          },
        },
        audio: "mic",
      });
      // console.log("Mededia Stream for publishing", localstream);
      let publish = await twyng.publish(localstream);
      // console.log("stream published sucessfully", publish);
      setPublishStream(publish);
      setPublishStreamId(publish.conference.userId);
    }
  };
  let flag = null;
  flag = setTimeout(() => {
    refLayout.current();
  }, "300");

  useEffect(() => {
    twyngJoin();
  }, []);

  //handle subscribe event
  const handlesubscirbe = async (data) => {
    // console.log("data for subscription", data.data);
    if (data.data) {
      let subscription = await twyng.subscribe(data.data);
      console.log("subscirbed data", subscription);

      if (
        subscription.streamInfo.mediaSource.videoSourceInfo.name === "screen"
      ) {
        setCurrentPin(subscription.streamId);
      }
      // setCurrentPin(id)

      setStreams((ps) => [
        ...ps,
        {
          ...subscription,
        },
      ]);
    }
  };

  //handle Screen Share
  let handleScreenShareClick = async () => {
    if (screenShareStatus === true) {
      const localstream = await twyng.createMediastream({ video: "screen" });
      let publishScreenShare = await twyng.publish(localstream);
      setPublishScreenShare(publishScreenShare);
      console.log("Screen Share Published successfully", publishScreenShare);
    }
  };
  if (screenShareStatus === false) {
    if (publishScreenShare) {

      publishScreenShare.stop();
    }
  }
  useEffect(() => {
    handleScreenShareClick();
  }, [screenShareStatus]);

  useEffect(() => {
    twyng.addEventListener("new-publisher", handlesubscirbe);
    return () => {
      twyng.removeEventListener("new-publisher", handlesubscirbe);
    };
  }, [publishStreamId]);

  useEffect(() => {
    console.log(streams, "streams data ");
  }, [streams]);

  //handle stream update confernce update and stream end
  useEffect(() => {
    const handleStreamUpdate = async (data) => {
      console.log("Stream updated infomation", data.data);
      setStreams((ps) => {
        return ps.map((stream) => {
          console.log(stream.streamId, data.data.id, "stream id check");
          if (stream.streamId === data.data.id) {
            console.log(stream.streamId, "check update stream");
            return { ...stream, video: data.data.video };
          } else {
            return stream;
          }
        });
      });
    };

    // const handleConferenceUpdate = async (data) => {
    //   console.log(
    //     "conferenceInfo",
    //     data.data.streams,
    //     "streams:",
    //     streams,
    //     "userId :",
    //     userId
    //   );
    // };

    const handleStreamEnd = (data) => {
      // console.log(data, "User left data");
      if (data) {
        setStreams((previousStreams) =>
          previousStreams.filter((s) => s.streamId !== data.data.id)
        );
      }
    };

    twyng.addEventListener("stream-updated", handleStreamUpdate);
    twyng.addEventListener("stream-ended", handleStreamEnd);
    // twyng.addEventListener("conference-info", handleConferenceUpdate);

    return () => {
      twyng.removeEventListener("stream-updated", handleStreamUpdate);
      twyng.removeEventListener("stream-ended", handleStreamEnd);
      // twyng.removeEventListener("conference-info", handleConferenceUpdate);
    };
  }, []);

  //mute video
  useEffect(() => {
    if (publishStream) {
      if (videoStatus === false) {
        publishStream.mute("video");
      }
      if (videoStatus === true) {
        publishStream.unmute("video");
      }
    }
  }, [videoStatus]);

  //mute audio
  useEffect(() => {
    if (publishStream) {
      if (audioStatus === false) {
        publishStream.mute("audio");
      }
      if (audioStatus === true) {
        publishStream.unmute("audio");
      }
    }
  }, [audioStatus]);

  //main component return
  return (
    <div className="meeting-wrapper">
      {/* Main screen for video */}
      <div className="main-screen" id="main-screen">
        {streams.length > 0 &&
          streams.map((stream) => {
            if (stream) {
              return (
                <Streams
                  currentPin={currentPin}
                  setCurrentPin={setCurrentPin}
                  stream={stream}
                  key={stream.streamId}
                />
              );
            }
          })}
      </div>

      {/* controls buttons */}
      <FooterControls
        twyngJoin={twyngJoin}
        setAudioStatus={setAudioStatus}
        setVideoStatus={setVideoStatus}
        videoStatus={videoStatus}
        audioStatus={audioStatus}
        screenShareStatus={screenShareStatus}
        setScreenShareStatus={setScreenShareStatus}
      />
    </div>
  );
}
