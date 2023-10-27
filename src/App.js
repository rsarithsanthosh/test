import React from "react";
import { Routes,Route } from "react-router-dom";
import MeetingPage from "./Routes/MeetingPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<MeetingPage/>}/>
    </Routes>

  );
}

export default App;
