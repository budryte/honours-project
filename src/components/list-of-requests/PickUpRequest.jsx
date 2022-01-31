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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
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

async function changeEstimatedCompletion(estimatedTime, parentId, id) {
  const fireStore = getFirestore();
  const auth = getAuth();
  console.log(parentId);
  console.log(auth.currentUser.email);
  const requestRef = doc(fireStore, "users", parentId, "requests", id);
  await updateDoc(requestRef, {
    estimatedTime: estimatedTime,
  });
}

async function changeTechnicianInCharge(technicianInCharge, parentId, id) {
  const fireStore = getFirestore();
  const auth = getAuth();
  console.log(parentId);
  console.log(auth.currentUser.email);
  const requestRef = doc(fireStore, "users", parentId, "requests", id);
  await updateDoc(requestRef, {
    technicianInCharge: technicianInCharge,
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

const statusValues = [
  "Waiting on materials",
  "In progress",
  "Waiting  to be collected",
  "Completed",
];

export default function PickUpRequest() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [approvalOpen, setApprovalOpen] = useState(false);
  const handleApprovalOpen = () => setApprovalOpen(true);
  const handleApprovalClose = () => setApprovalOpen(false);

  const [statusOpen, setStatusOpen] = useState(false);
  const handleStatusOpen = () => setStatusOpen(true);
  const handleStatusClose = () => setStatusOpen(false);

  const [technicianOpen, setTechnicianOpen] = useState(false);
  const handleTechnicianOpen = () => setTechnicianOpen(true);
  const handleTechnicianClose = () => setTechnicianOpen(false);

  const [estimatedCompletion, setEstimatedCompletionOpen] = useState(false);
  const handleEstimatedCompletionOpen = () => setEstimatedCompletionOpen(true);
  const handleEstimatedCompletionClose = () =>
    setEstimatedCompletionOpen(false);

  let navigate = useNavigate();
  const { state } = useLocation();
  const {
    time,
    id,
    firstname,
    lastname,
    email,
    grant,
    account,
    approvalRequired,
    supervisor,
    ...details
  } = state.data;
  const { parentId } = state;
  const [status, setStatus] = useState(state.data.status);
  const [technicianInCharge, setTechnicianInCharge] = useState(
    state.data.technicianInCharge
  );
  const [estimatedTime, setEstimatedTime] = useState(
    new Date(state.data.estimatedTime?.seconds * 1000 ?? null)
  );

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
            <br></br>
            Date: {new Date(time.seconds * 1000).toLocaleString()}
          </h4>
          <h3>Request Details</h3>
          <TableContainer>
            <Table sx={{ minWidth: 450 }} aria-label="simple table">
              <TableBody>
                {Object.keys(details ?? {})
                  ?.filter(
                    (key) =>
                      key !== "estimatedTime" &&
                      key !== "status" &&
                      key !== "technicianInCharge"
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
              </TableBody>
            </Table>
          </TableContainer>
          <br></br>
          <h3>Additional Information</h3>
          <List>
            <ListItem disablePadding>
              <ListItemText>
                <b>Supervisor approval required: </b>
                {approvalRequired}
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText>
                <b>Supervised by: </b>
                {supervisor}
              </ListItemText>
            </ListItem>
            {grant !== undefined ? (
              <ListItem disablePadding>
                <ListItemText>
                  <b>Student grant: </b>£{grant}
                </ListItemText>
              </ListItem>
            ) : undefined}
            {account !== undefined ? (
              <ListItem disablePadding>
                <ListItemText>
                  <b>Account: </b>
                  {account}
                </ListItemText>
              </ListItem>
            ) : undefined}
          </List>
          <h3>Technician Details</h3>
          <List className="request-details">
            {status === "In progress" ? (
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => {
                      handleTechnicianOpen();
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                }
              >
                <ListItemText>
                  <b>Technician in charge:</b> {technicianInCharge}
                </ListItemText>
              </ListItem>
            ) : undefined}
            <ListItem
              disablePadding
              secondaryAction={
                status === "In progress" ? (
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => {
                      handleStatusOpen();
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                ) : undefined
              }
            >
              <ListItemText>
                <b>Status:</b> {status}
              </ListItemText>
            </ListItem>
            {status === "In progress" ? (
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => {
                      handleEstimatedCompletionOpen();
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                }
              >
                <ListItemText>
                  <b>Estimated completion date: </b>
                  {estimatedTime.toLocaleDateString()}
                </ListItemText>
              </ListItem>
            ) : undefined}
          </List>
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
            {status === "Waiting on technician" ? (
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
            ) : undefined}
            {status === "Waiting on technician" ? (
              <Button
                variant="contained"
                onClick={() => {
                  handleOpen();
                }}
              >
                Pick Up Request
              </Button>
            ) : undefined}

            {/* Pick up request */}
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
                    disabled={estimatedTime === null}
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

            {/* Send request to supervisor */}
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

            {/* Change estimated time of completion */}
            <Modal
              open={estimatedCompletion}
              onClose={handleEstimatedCompletionClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="modal-style-bigger">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Change estimated completion time
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
                        handleEstimatedCompletionClose();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={() => {
                      changeEstimatedCompletion(estimatedTime, parentId, id);
                      handleEstimatedCompletionClose();
                    }}
                  >
                    Save
                  </Button>
                </div>
              </Box>
            </Modal>

            {/* Change status */}
            <Modal
              open={statusOpen}
              onClose={handleStatusClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="modal-style">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Change Status
                </Typography>
                {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Select status:
                </Typography> */}
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">
                    Status *
                  </InputLabel>
                  <Select
                    className="item"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={status}
                    label="Status * "
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                  >
                    {statusValues.map((val) => (
                      <MenuItem value={val}>{val}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div className="modal-buttons">
                  <div className="request-form-button">
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        handleStatusClose();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={() => {
                      status(status, parentId, id);
                      handleStatusClose();
                    }}
                  >
                    Save
                  </Button>
                </div>
              </Box>
            </Modal>

            {/* Change technician in charge */}
            <Modal
              open={technicianOpen}
              onClose={handleTechnicianOpen}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="modal-style-bigger">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Change technician in charge
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Enter another technician email:
                </Typography>
                <TextField
                  className="item"
                  id="outlined-basic"
                  label="Supervisor"
                  variant="outlined"
                  size="small"
                  required
                  value={technicianInCharge}
                  onChange={(e) => {
                    setTechnicianInCharge(e.target.value);
                  }}
                />
                <div className="modal-buttons">
                  <div className="request-form-button">
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        handleTechnicianClose();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={() => {
                      changeTechnicianInCharge(
                        technicianInCharge,
                        parentId,
                        id
                      );
                      handleTechnicianClose();
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
