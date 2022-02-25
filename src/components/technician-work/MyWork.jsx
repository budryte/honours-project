import React from "react";
import Navbar from "../navbar/Navbar";
import Requests from "../small-components/Requests";

export default function MyWork() {
  return (
    <div>
      <Navbar />
      <div className="box-list">
        <div className="page-title">My Work</div>
        <Requests prevPage="/my-work" />
      </div>
    </div>
  );
}
