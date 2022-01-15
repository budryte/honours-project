import React from "react";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import "./list-of-requests.scss";

export default function ListofRequests() {
  let navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="box">
        <div className="page-title">List of Requests</div>
        <div className="list-container">
          {/* todo: if pending request exists, then show list with map */}
          <List>
            <ListItem>
              <Button
                onClick={() => navigate("/pick-up-request")}
                className="list-of-request-button"
              >
                <div className="list-of-request-item">
                  <div>
                    <p>
                      <b className="id">RTA ID </b> Date: 15/11/21
                    </p>
                  </div>
                  <p>
                    <b>Pending approval</b>
                  </p>
                </div>
              </Button>
            </ListItem>
          </List>
        </div>
      </div>
    </div>
  );
}
