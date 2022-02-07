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

export default function MainRequestDetails() {
  const { state } = useLocation();
  const { time, id, firstname, lastname, email, linkToFolder, ...details } =
    state.data;
  return (
    <div>
      <h1>{id}</h1>
      <h3>
        Requested by {firstname} {lastname}
        <br></br>
        {email}
        <br></br>
        Submitted: {new Date(time.seconds * 1000).toLocaleString()}
      </h3>
      <h3>Request Details</h3>
      <TableContainer>
        <Table sx={{ minWidth: 450 }} aria-label="simple table">
          <TableBody>
            {Object.keys(details ?? {})
              ?.filter(
                (key) =>
                  key !== "estimatedTime" &&
                  key !== "status" &&
                  key !== "technicianInCharge" &&
                  key !== "account" &&
                  key !== "grant" &&
                  key !== "approvalRequired" &&
                  key !== "materials" &&
                  key !== "supervisor"
              )
              .map((key) => (
                <TableRow key={key}>
                  <TableCell component="th" scope="row">
                    {(key.charAt(0).toUpperCase() + key.slice(1))
                      .match(/([A-Z]?[^A-Z]*)/g)
                      .slice(0, -1)
                      .join(" ")}
                  </TableCell>
                  <TableCell>{details[key]}</TableCell>
                </TableRow>
              ))}
            {linkToFolder !== undefined ? (
              <TableRow>
                <TableCell>Link To Folder</TableCell>
                <TableCell>
                  <Link href={linkToFolder}>{linkToFolder}</Link>
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
