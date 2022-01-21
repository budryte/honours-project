import React, { useState } from "react";
import Navbar from "../navbar/Navbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, updateDoc, getFirestore } from "firebase/firestore";

import "./pending-requests.scss";

async function addFields(grant, account, parentId, id) {
  const db = getFirestore();
  console.log(parentId);
  const requestRef = doc(db, "users", parentId, "requests", id);
  await updateDoc(requestRef, {
    grant: grant,
    account: account,
    status: "Waiting on technician",
  });
}

export default function ReviewPendingRequest() {
  const [grant, setGrant] = useState("");
  const [account, setAccount] = useState("");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const handleConfirmationOpen = () => setConfirmationOpen(true);

  let navigate = useNavigate();
  const { state } = useLocation();
  const { time, id, firstname, lastname, email, ...details } = state.data;
  const { parentId } = state;

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
                    {new Date(time.seconds * 1000).toGMTString()}
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
                  navigate("/pending-requests");
                }}
              >
                Back
              </Button>
            </div>
            <Button
              variant="contained"
              onClick={() => {
                handleOpen();
              }}
            >
              Sign
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="modal-style">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Approve Request
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Enter account to be charged:
                </Typography>
                <TextField
                  className="form-group"
                  id="outlined-basic"
                  label="Account to be charged"
                  variant="outlined"
                  size="small"
                  required
                  value={account}
                  onChange={(e) => {
                    setAccount(e.target.value);
                  }}
                />
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Enter student grant:
                </Typography>
                <TextField
                  className="form-group"
                  id="outlined-basic"
                  label="Grant"
                  variant="outlined"
                  size="small"
                  required
                  value={grant}
                  onChange={(e) => {
                    setGrant(e.target.value);
                  }}
                />
                <div className="modal-buttons">
                  <div className="request-form-button">
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        handleClose();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  <Button
                    variant="outlined"
                    color="success"
                    disabled={grant === "" || account === ""}
                    onClick={() => {
                      addFields(grant, account, parentId, id);
                      handleClose();
                      handleConfirmationOpen();
                    }}
                  >
                    Sign
                  </Button>
                </div>
              </Box>
            </Modal>
            <Modal
              open={confirmationOpen}
              onClose={() => {
                navigate("/home");
              }}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="modal-style">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Confirmation
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Your request has been approved successfully. <br></br>You can
                  now track this request.
                </Typography>
                <div className="modal-buttons">
                  <div className="request-form-button">
                    <Button
                      variant="outlined"
                      onClick={() => {
                        navigate("/track-requests");
                      }}
                    >
                      Track Request
                    </Button>
                  </div>
                </div>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
