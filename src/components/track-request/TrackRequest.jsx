import React from "react";
import Navbar from "../navbar/Navbar";
import Requests from "../../containers/Requests";

export default function TrackRequest() {
  return (
    <div>
      <Navbar />
      <main className="box">
        <h1 className="page-title">Track Your Requests</h1>
        <Requests prevPage="/track-requests" />
      </main>
    </div>
  );
}
