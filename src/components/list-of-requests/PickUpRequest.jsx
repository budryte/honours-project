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
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, updateDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import "./list-of-requests.scss";

async function pickUpRequest(estimatedTime, parentId, id) {
  const fireStore = getFirestore();
  const auth = getAuth();
  console.log(parentId);
  console.log(auth.currentUser.email);
  const requestRef = doc(fireStore, "users", parentId, "requests", id);
  await updateDoc(requestRef, {
    estimatedTime: estimatedTime,
    technicianInCharge: auth.currentUser.email,
    status: "In progress",
  });
}

async function sendToSupervisor(parentId, id) {
  const fireStore = getFirestore();
  const auth = getAuth();
  console.log(parentId);
  console.log(auth.currentUser.email);
  const requestRef = doc(fireStore, "users", parentId, "requests", id);
  await updateDoc(requestRef, {
    approvalRequired: "Yes",
    technicianInCharge: auth.currentUser.email,
    status: "Pending approval",
  });
}

export default function PickUpRequest() {
  const [supervisor, setSupervisor] = useState("");
  const [estimatedTime, setEstimatedTime] = useState(null);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [approvalOpen, setApprovalOpen] = useState(false);
  const handleApprovalOpen = () => setApprovalOpen(true);
  const handleApprovalClose = () => setApprovalOpen(false);

  let navigate = useNavigate();
  const { state } = useLocation();
  const {
    time,
    estimatedTime: completionTime,
    id,
    firstname,
    lastname,
    email,
    ...details
  } = state.data;
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
                    {new Date(time.seconds * 1000).toLocaleString()}
                  </TableCell>
                </TableRow>
                {details.status === "In progress" ? (
                  <TableRow key={"completionTime"}>
                    <TableCell component="th" scope="row">
                      Date finished
                    </TableCell>
                    <TableCell>
                      {new Date(completionTime.seconds * 1000).toLocaleString()}
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
                  navigate("/list-of-requests");
                }}
              >
                Back
              </Button>
            </div>
            <div className="request-form-button">
              <Button
                variant="contained"
                onClick={() => {
                  handleApprovalOpen();
                }}
              >
                Send to Supervisor
              </Button>
            </div>
            <Button
              variant="contained"
              onClick={() => {
                handleOpen();
              }}
            >
              Pick Up Request
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="modal-style">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Pick Up Request
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Enter estimated time of completion:
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Completion time"
                    size="small"
                    value={estimatedTime}
                    onChange={(newValue) => {
                      setEstimatedTime(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
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
                    onClick={() => {
                      pickUpRequest(estimatedTime, parentId, id);
                      handleClose();
                    }}
                  >
                    Save
                  </Button>
                </div>
              </Box>
            </Modal>
            <Modal
              open={approvalOpen}
              onClose={handleApprovalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="modal-style-bigger">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Get Approval
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Send this request to supervisor to be approved:
                </Typography>
                <TextField
                  className="form-group"
                  id="outlined-basic"
                  label="Supervisor's email"
                  variant="outlined"
                  required
                  size="small"
                  value={details.supervisor}
                />
                <div className="modal-buttons">
                  <div className="request-form-button">
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        handleApprovalClose();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={() => {
                      sendToSupervisor(parentId, id);
                      handleApprovalClose();
                    }}
                  >
                    Send
                  </Button>
                </div>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
