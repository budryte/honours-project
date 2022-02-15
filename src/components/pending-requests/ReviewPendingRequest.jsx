import React, { useState } from "react";
import Navbar from "../navbar/Navbar";
import BackButton from "../small-components/BackButton";
import SupervisorDetails from "../small-components/SupervisorDetails";
import MainRequestDetails from "../small-components/MainRequestDetails";
import TechnicianDetails from "../small-components/TechnicianDetails";
import { Grid, Button, Box, Typography, TextField, Modal } from "@mui/material";
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
  const { id } = state.data;
  const { parentId } = state;

  return (
    <div>
      <Navbar />
      <div className="box">
        <div className="page-title">Review Request</div>
        <div className="white-container">
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <div className="back-button">
                <BackButton pageTitle={"/pending-requests"} />
              </div>
            </Grid>
            <Grid item xs={11}>
              <MainRequestDetails />
              <SupervisorDetails />
              <TechnicianDetails />
              <div className="buttons">
                <Button
                  variant="contained"
                  onClick={() => {
                    handleOpen();
                  }}
                >
                  Approve
                </Button>
              </div>
            </Grid>
          </Grid>
          {/* Sign request modal */}
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
                Enter student grant (£):
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
                  Save
                </Button>
              </div>
            </Box>
          </Modal>

          {/* Confirmation modal */}
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
  );
}
