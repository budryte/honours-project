import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Link,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";

export default function MainRequestDetails() {
  const { state } = useLocation();
  const { time, id, firstname, lastname, email, linkToFolder, status } =
    state.data;

  const requestDetails = {
    discipline: state.data.discipline,
    projectType: state.data.projectType,
    priority: state.data.priority,
    natureOfRequest: state.data.extraInfo,
  };
  return (
    <div>
      <h1 style={{ marginTop: "10px", fontFamily: "Arial", fontSize: "28px" }}>
        {id}
      </h1>
      <h2
        style={{
          fontSize: "24px",
          color: "#4365e2",
        }}
      >
        {status}
      </h2>
      <p style={{ fontSize: "20px" }}>
        Requested by: {""}
        <b>
          {firstname} {lastname}
        </b>
        <br></br>
        Email: <b>{email}</b>
        <br></br>
        Submitted: <b>{new Date(time.seconds * 1000).toLocaleDateString()}</b>
      </p>
      <h2>Main Request Details</h2>
      <TableContainer>
        <Table sx={{ width: "auto" }} aria-label="main request details table">
          <TableBody>
            {Object.keys(requestDetails ?? {}).map((key) => (
              <TableRow key={key} hover>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ width: 200 }}
                  style={{ fontWeight: "bold" }}
                >
                  {(key.charAt(0).toUpperCase() + key.slice(1))
                    .match(/([A-Z]?[^A-Z]*)/g)
                    .slice(0, -1)
                    .join(" ")}
                </TableCell>
                <TableCell>{requestDetails[key]}</TableCell>
              </TableRow>
            ))}
            {linkToFolder !== undefined ? (
              <TableRow hover>
                <TableCell style={{ fontWeight: "bold" }}>
                  Link To OneDrive Folder *
                </TableCell>
                <TableCell style={{ display: "flex", justifyContent: "row" }}>
                  <Link href={linkToFolder} target="_blank" rel="noopener">
                    {linkToFolder}
                  </Link>
                  <LaunchIcon
                    style={{
                      color: "#4365e2",
                      fontSize: 16,
                      marginTop: 1.5,
                      marginLeft: 5,
                    }}
                  />
                </TableCell>
              </TableRow>
            ) : undefined}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <p style={{ fontSize: "16px" }}>
        {" "}
        <b style={{ color: "red" }}>* Please note:</b> for testing purposes now
        links lead to random websites - in production links would lead to{" "}
        <b>OneDrive folder</b> where you would be able to find drawings and
        other files related to the request
      </p>
      <br></br> */}
    </div>
  );
}
