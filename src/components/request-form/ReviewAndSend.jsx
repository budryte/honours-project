import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { getAuth } from "firebase/auth";
import { collection, addDoc, getFirestore } from "firebase/firestore";

async function saveToFirestore(details, extraInfo) {
  //TO-DO: Save to Firestore
  const db = getFirestore();
  const auth = getAuth();
  await addDoc(collection(db, "users", auth.currentUser.uid, "requests"), {
    ...details,
    extraInfo,
  });
  alert("Successfully uploaded");
}

export function ReviewAndSend(props) {
  const { handleChange, details, extraInfo } = props;

  return (
    <div className="request-form-tab">
      <h2>Review Request Details</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 450 }} aria-label="simple table">
          <TableHead>
            {/* <TableRow className="table-header">
              <TableCell>Title</TableCell>
              <TableCell>Value</TableCell>
            </TableRow> */}
          </TableHead>
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
            {extraInfo !== "" && (
              <TableRow key={extraInfo}>
                <TableCell component="th" scope="row">
                  Additional Info
                </TableCell>
                <TableCell>{extraInfo}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="buttons">
        <div className="request-form-button">
          <Button
            variant="contained"
            onClick={() => {
              handleChange(null, 1);
            }}
          >
            Back
          </Button>
        </div>
        <Button
          variant="contained"
          onClick={() => {
            //TO-DO: Save to Firestore
            saveToFirestore(details, extraInfo);
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
