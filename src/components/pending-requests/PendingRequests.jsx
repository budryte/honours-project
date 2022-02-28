import React from "react";
import Navbar from "../navbar/Navbar";
import Requests from "../../containers/Requests";

export default function PendingRequests() {
  return (
    <div>
      <Navbar />
      <div className="box">
        <div className="page-title">Pending Requests</div>
        <Requests prevPage="/pending-requests" />
      </div>
    </div>
  );
}
