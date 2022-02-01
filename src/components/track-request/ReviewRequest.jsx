import React from "react";
import Navbar from "../navbar/Navbar";
import BackButton from "../small-components/BackButon";
import SupervisorDetails from "../small-components/SupervisorDetails";
import MainRequestDetails from "../small-components/MainRequestDetails";
import TechnicianDetails from "../small-components/TechnicianDetails";
import { Grid } from "@mui/material";

export default function ReviewRequest() {
  return (
    <div>
      <Navbar />
      <div className="box">
        <div className="page-title">Review Request</div>
        <div className="white-container">
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <div className="back-button">
                <BackButton pageTitle={"/track-requests"} />
              </div>
            </Grid>
            <Grid item xs={11}>
              <MainRequestDetails />
              <SupervisorDetails />
              <TechnicianDetails />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}
