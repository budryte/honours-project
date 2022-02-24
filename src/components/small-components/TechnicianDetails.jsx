import React from "react";
import { List, ListItem } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function TechnicianDetails() {
  const { state } = useLocation();
  const { technicianInCharge, status } = state.data;
  return (
    <div>
      <h2>Technician Details</h2>
      <List className="request-details">
        {technicianInCharge !== undefined ? (
          <ListItem disablePadding>
            <div className="tech-details-item">
              <b>Technician in charge:</b> {technicianInCharge}
            </div>
          </ListItem>
        ) : undefined}
        <ListItem disablePadding>
          <div className="tech-details-item">
            <b>Status:</b> {status}
          </div>
        </ListItem>
        {state.data.estimatedTime !== undefined ? (
          <ListItem disablePadding>
            <div className="tech-details-item">
              <b>Estimated completion date: </b>
              {new Date(
                state.data.estimatedTime.seconds * 1000
              ).toLocaleDateString()}
            </div>
          </ListItem>
        ) : undefined}
      </List>
    </div>
  );
}
