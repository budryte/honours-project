import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";

export default function PageNotFound() {
  let navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div className="box">
        <h1 className="page-title">Page Not Found</h1>
        <div className="white-container">
          <h2>Page you are looking for cannot be accessed.</h2>
          <p style={{ fontSize: "18px" }}>Go back to Home page.</p>
          <p>
            <Button
              variant="contained"
              onClick={() => {
                navigate("/");
              }}
            >
              Go to Home
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
