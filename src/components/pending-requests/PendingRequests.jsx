import React from "react";
import Navbar from "../navbar/Navbar";
import Requests from "../../containers/Requests";

export default function PendingRequests() {
  return (
    <div>
      <Navbar />
      <main className="box">
        <h1 className="page-title">Pending Requests</h1>
        <Requests prevPage="/pending-requests" />
      </main>
    </div>
  );
}
