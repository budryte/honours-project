import React from "react";
import { List, ListItem } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function SupervisorDetails() {
  const { state } = useLocation();
  const { grant, account, approvalRequired, supervisor } = state.data;
  return (
    <div>
      <h2>Other Details</h2>
      <List>
        <ListItem disablePadding>
          <div className="tech-details-item">
            <b>Supervisor approval required: </b>
            {approvalRequired}
          </div>
        </ListItem>
        {supervisor !== undefined ? (
          <ListItem disablePadding>
            <div className="tech-details-item">
              <b>Supervised by: </b>
              {supervisor}
            </div>
          </ListItem>
        ) : undefined}
        {grant !== undefined ? (
          <ListItem disablePadding>
            <div className="tech-details-item">
              <b>Student grant: </b>£{grant}
            </div>
          </ListItem>
        ) : undefined}
        {account !== undefined ? (
          <ListItem disablePadding>
            <div className="tech-details-item">
              <b>Account to be charged: </b>
              {account}
            </div>
          </ListItem>
        ) : undefined}
      </List>
    </div>
  );
}
