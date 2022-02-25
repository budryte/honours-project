import React from "react";
import Navbar from "../navbar/Navbar";
import Requests from "../small-components/Requests";

export default function TrackRequest() {
  return (
    <div>
      <Navbar />
      <div className="box">
        <div className="page-title">Track Your Requests</div>
        <Requests prevPage="/track-requests" />
      </div>
    </div>
  );
}
