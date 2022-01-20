import React, { useState } from "react";
import Navbar from "../navbar/Navbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, updateDoc, getFirestore } from "firebase/firestore";

async function updateDetails(grant, account, parentId, id) {
  const db = getFirestore();
  console.log(parentId);
  const requestRef = doc(db, "users", parentId, "requests", id);
  await updateDoc(requestRef, {
    grant: grant,
    account: account,
    status: "Waiting on technician",
  });
}

export default function ReviewArchivedRequest() {
  let navigate = useNavigate();
  const { state } = useLocation();
  const { time, estimatedTime, id, firstname, lastname, email, ...details } =
    state.data;

  return (
    <div>
      <Navbar />
      <div className="box">
        <div className="page-title">Archived Request</div>
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
                    {new Date(time.seconds * 1000).toGMTString()}
                  </TableCell>
                </TableRow>
                <TableRow key={"estimatedTime"}>
                  <TableCell component="th" scope="row">
                    Date finished
                  </TableCell>
                  <TableCell>
                    {new Date(estimatedTime.seconds * 1000).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <div className="buttons">
            <div className="request-form-button">
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/archive");
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
