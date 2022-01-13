import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";

import "./pending-requests.scss";

export default function ReviewPendingRequest() {
  const [account, setAccount] = useState("");
  const [grant, setGrant] = useState("");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const handleConfirmationOpen = () => setConfirmationOpen(true);
  const handleConfirmationClose = () => setConfirmationOpen(false);

  let navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="box">
        <div className="page-title">Review Request</div>
        <div className="white-container">
          <h2>RTA ID</h2>
          <TableContainer>
            <Table sx={{ minWidth: 450 }} aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row"></TableCell>
                  <TableCell>hi</TableCell>
                  <TableCell>hi</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row"></TableCell>
                  <TableCell>hi</TableCell>
                  <TableCell>hi</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row"></TableCell>
                  <TableCell>hi</TableCell>
                  <TableCell>hi</TableCell>
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
                  label="Account"
                  variant="outlined"
                  required
                  size="small"
                  value={account}
                />
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Enter student grant:
                </Typography>
                <TextField
                  className="form-group"
                  id="outlined-basic"
                  label="Grant"
                  variant="outlined"
                  required
                  size="small"
                  value={grant}
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
                    onClick={() => {
                      handleClose();
                      handleConfirmationOpen();
                    }}
                  >
                    Send
                  </Button>
                </div>
              </Box>
            </Modal>
            <Modal
              open={confirmationOpen}
              onClose={handleConfirmationClose}
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
                        navigate("/track-request");
                      }}
                    >
                      Track Request
                    </Button>
                  </div>

                  <Button
                    variant="outlined"
                    onClick={() => {
                      navigate("/home");
                    }}
                  >
                    Home
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
