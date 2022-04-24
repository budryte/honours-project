import React, { useState } from "react";
import Navbar from "../navbar/Navbar";
import Requests from "../../containers/Requests";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import Charts from "../small-components/Charts";

export default function ListofRequests() {
  const [alignment, setAlignment] = useState("requests");
  const [requests, setRequests] = useState([]);

  const handleChange = (_, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <div>
      <Navbar />
      <main className="box-list">
        <h1 className="page-title">List of Requests</h1>
        <div className="white-container" style={{ paddingBottom: 0 }}>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="requests">Requests</ToggleButton>
            <ToggleButton value="overview">Overview</ToggleButton>
          </ToggleButtonGroup>
        </div>
        {alignment === "requests" ? (
          <Requests setRequests={setRequests} prevPage="/list-of-requests" />
        ) : (
          <Charts requests={requests} />
        )}
      </main>
    </div>
  );
}
