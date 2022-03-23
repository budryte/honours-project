import React from "react";
import { Link } from "@mui/material";
import Navbar from "../navbar/Navbar";

export default function AboutPage() {
  const linkToDundeePage = "https://www.dundee.ac.uk/";
  return (
    <div>
      <Navbar />
      <div className="box">
        <h1 className="page-title">Help</h1>
        <div className="white-container">
          <h2>Contacts</h2>
          <h3>If thre are any problems with the system, please contact:</h3>
          Emilija Budryte -
          <Link className="forgot-password-link">ebudryte@dundee.ac.uk</Link>
          <h3>Access the official University of Dundee website here:</h3>
          <Link
            className="forgot-password-link"
            href={linkToDundeePage}
            target="_blank"
            rel="noopener"
          >
            {linkToDundeePage}
          </Link>
        </div>
      </div>
    </div>
  );
}
