import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function SupervisorDetails() {
  const { state } = useLocation();
  const { grant, account, approvalRequired, supervisor } = state.data;
  return (
    <div>
      <h3>Additional Information</h3>
      <List>
        <ListItem disablePadding>
          <ListItemText>
            <b>Supervisor approval required: </b>
            {approvalRequired}
          </ListItemText>
        </ListItem>
        {supervisor !== undefined ? (
          <ListItem disablePadding>
            <ListItemText>
              <b>Supervised by: </b>
              {supervisor}
            </ListItemText>
          </ListItem>
        ) : undefined}
        {grant !== undefined ? (
          <ListItem disablePadding>
            <ListItemText>
              <b>Student grant: </b>£{grant}
            </ListItemText>
          </ListItem>
        ) : undefined}
        {account !== undefined ? (
          <ListItem disablePadding>
            <ListItemText>
              <b>Account: </b>
              {account}
            </ListItemText>
          </ListItem>
        ) : undefined}
      </List>
    </div>
  );
}
