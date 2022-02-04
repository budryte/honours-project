import React from "react";
import Navbar from "../navbar/Navbar";
import BackButton from "../small-components/BackButon";
import SupervisorDetails from "../small-components/SupervisorDetails";
import MainRequestDetails from "../small-components/MainRequestDetails";
import TechnicianDetails from "../small-components/TechnicianDetails";
import MaterialsTable from "../small-components/MaterialsTable";
import { Grid } from "@mui/material";

export default function ReviewArchivedRequest() {
  return (
    <div>
      <Navbar />
      <div className="box">
        <div className="page-title">Archived Request</div>
        <div className="white-container">
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <div className="back-button">
                <BackButton pageTitle={"/archive"} />
              </div>
            </Grid>
            <Grid item xs={11}>
              <MainRequestDetails />
              <SupervisorDetails />
              <TechnicianDetails />
              <MaterialsTable />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}
