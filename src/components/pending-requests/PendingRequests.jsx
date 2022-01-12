import React from "react";
import Navbar from "../navbar/Navbar";

import "./pending-requests.scss";

export default function PendingRequests() {
  return (
    <div>
      <Navbar />
      <div className="box">
        <div className="page-title">Pending Requests</div>
        <div className="agreement-container">
          <h2>From students</h2>
          <p>There are no pending requests.</p>
          <h2>From technicians</h2>
          <p>There are no pending requests.</p>
        </div>
      </div>
    </div>
  );
}
