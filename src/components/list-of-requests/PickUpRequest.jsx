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
import { useNavigate } from "react-router-dom";

import "./list-of-requests.scss";

export default function PickUpRequest() {
  const [supervisor, setSupervisor] = useState("");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [approvalOpen, setApprovalOpen] = useState(false);
  const handleApprovalOpen = () => setApprovalOpen(true);
  const handleApprovalClose = () => setApprovalOpen(false);

  const [estimatedTime, setEstimatedTime] = useState(null);

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
              </TableBody>
            </Table>
          </TableContainer>
          <div className="buttons">
            <div className="request-form-button">
              <Button
                variant="contained"
                onClick={() => {
                  handleApprovalOpen();
                }}
              >
                Get approval
              </Button>
            </div>
            <Button
              variant="contained"
              onClick={() => {
                handleOpen();
              }}
            >
              Pick up request
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
                {/* <TextField
                  className="form-group"
                  id="outlined-basic"
                  label="Estimated time"
                  variant="outlined"
                  required
                  size="small"
                  value={estimatedTime}
                /> */}
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
                      handleClose();
                    }}
                  >
                    Send
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
                  label="Suepervisor"
                  variant="outlined"
                  required
                  size="small"
                  value={supervisor}
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
