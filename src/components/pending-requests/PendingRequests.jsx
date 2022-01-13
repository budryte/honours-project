import React from "react";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import "./pending-requests.scss";

export default function PendingRequests() {
  let navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="box">
        <div className="page-title">Pending Requests</div>
        <div className="white-container">
          <h2>From students</h2>
          {/* todo: if pending request exists, then show list with map */}
          <List>
            <ListItem>
              <div className="pending-request-list-item">
                <p>
                  <b>RTA ID</b>
                </p>
                <Button onClick={() => navigate("/review-pending-request")}>
                  Review
                </Button>
              </div>
            </ListItem>
          </List>
          <p>There are no pending requests.</p>
          <h2>From technicians</h2>
          {/* todo: if pending request exists, then show list */}
          {/* <List>
            <ListItem></ListItem>
          </List> */}
          <p>There are no pending requests.</p>
        </div>
      </div>
    </div>
  );
}
