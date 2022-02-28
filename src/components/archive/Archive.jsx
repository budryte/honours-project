import React from "react";
import Navbar from "../navbar/Navbar";
import Requests from "../../containers/Requests";

export default function Archive() {
  return (
    <div>
      <Navbar />
      <div className="box">
        <div className="page-title">Archive</div>
        <Requests prevPage="/archive" />
      </div>
    </div>
  );
}
