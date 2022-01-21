import React, { useState } from "react";
import Navbar from "../navbar/Navbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default function ReviewRequest() {
  let navigate = useNavigate();
  const { state } = useLocation();
  const { time, estimatedTime, id, firstname, lastname, email, ...details } =
    state.data;

  return (
    <div>
      <Navbar />
      <div className="box">
        <div className="page-title">Review Request</div>
        <div className="white-container">
          <h2>{id}</h2>
          <h4>
            Requested by {firstname} {lastname}
            <br></br>
            {email}
          </h4>
          <TableContainer>
            <Table sx={{ minWidth: 450 }} aria-label="simple table">
              <TableBody>
                {Object.keys(details ?? {})?.map((key) => (
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
                <TableRow key={"time"}>
                  <TableCell component="th" scope="row">
                    Date Submitted
                  </TableCell>
                  <TableCell>
                    {new Date(time.seconds * 1000).toLocaleString()}
                  </TableCell>
                </TableRow>
                {details.status === "In progress" ? (
                  <TableRow key={"estimatedTime"}>
                    <TableCell component="th" scope="row">
                      Date finished
                    </TableCell>
                    <TableCell>
                      {new Date(estimatedTime.seconds * 1000).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ) : undefined}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="buttons">
            <div className="request-form-button">
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/track-requests");
                }}
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
