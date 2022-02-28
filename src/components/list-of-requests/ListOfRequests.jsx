import React from "react";
import Navbar from "../navbar/Navbar";
import Requests from "../../containers/Requests";

export default function ListofRequests() {
  return (
    <div>
      <Navbar />
      <div className="box-list">
        <div className="page-title">List of Requests</div>
        <Requests prevPage="/list-of-requests" />
      </div>
    </div>
  );
}
