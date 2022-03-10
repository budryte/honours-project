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
      <h1>{id}</h1>
      <p
        style={{
          fontSize: "24px",
          color: "#4365e2",
        }}
      >
        <b>{status}</b>
      </p>
      <p style={{ fontSize: "20px" }}>
        Requested by{" "}
        <b>
          {firstname} {lastname}
        </b>
        <br></br>
        <b style={{ fontStyle: "italic" }}>{email}</b>
        <br></br>
        Submitted: <b>{new Date(time.seconds * 1000).toLocaleDateString()}</b>
      </p>
      <h2>Request Details</h2>
      <TableContainer>
        <Table sx={{ minWidth: 450 }} aria-label="simple table">
          <TableBody>
            {Object.keys(requestDetails ?? {}).map((key) => (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  {(key.charAt(0).toUpperCase() + key.slice(1))
                    .match(/([A-Z]?[^A-Z]*)/g)
                    .slice(0, -1)
                    .join(" ")}
                </TableCell>
                <TableCell>{requestDetails[key]}</TableCell>
              </TableRow>
            ))}
            {linkToFolder !== undefined ? (
              <TableRow>
                <TableCell>Link To Folder</TableCell>
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
      <br></br>
    </div>
  );
}
