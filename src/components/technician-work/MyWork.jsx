import React from "react";
import Navbar from "../navbar/Navbar";
import Requests from "../../containers/Requests";

export default function MyWork() {
  return (
    <div>
      <Navbar />
      <main className="box-list">
        <h1 className="page-title">My Work</h1>
        <Requests prevPage="/my-work" />
      </main>
    </div>
  );
}
