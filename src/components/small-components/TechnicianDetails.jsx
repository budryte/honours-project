import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function TechnicianDetails() {
  const { state } = useLocation();
  const { technicianInCharge, status } = state.data;
  return (
    <div>
      <h3>Technician Details</h3>
      <List className="request-details">
        {technicianInCharge !== undefined ? (
          <ListItem disablePadding>
            <ListItemText>
              <b>Technician in charge:</b> {technicianInCharge}
            </ListItemText>
          </ListItem>
        ) : undefined}
        <ListItem disablePadding>
          <ListItemText>
            <b>Status:</b> {status}
          </ListItemText>
        </ListItem>
        {state.data.estimatedTime !== undefined ? (
          <ListItem disablePadding>
            <ListItemText>
              <b>Estimated completion date: </b>
              {new Date(
                state.data.estimatedTime.seconds * 1000
              ).toLocaleDateString()}
            </ListItemText>
          </ListItem>
        ) : undefined}
      </List>
    </div>
  );
}
