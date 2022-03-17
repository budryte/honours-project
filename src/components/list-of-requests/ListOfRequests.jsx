import React from "react";
import Navbar from "../navbar/Navbar";
import Requests from "../../containers/Requests";

export default function ListofRequests() {
  return (
    <div>
      <Navbar />
      <main className="box-list">
        <h1 className="page-title">List of Requests</h1>
        <Requests prevPage="/list-of-requests" />
      </main>
    </div>
  );
}
