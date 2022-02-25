import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import BackButton from "../small-components/BackButton";
import SupervisorDetails from "../small-components/SupervisorDetails";
import MainRequestDetails from "../small-components/MainRequestDetails";
import MaterialsTable from "../small-components/MaterialsTable";
import CommentsTable from "../small-components/CommentsTable";
import DeleteRequest from "../small-components/DeleteRequest";
import {
  Button,
  Box,
  Typography,
  TextField,
  Modal,
  List,
  ListItem,
  MenuItem,
  IconButton,
  Select,
  Grid,
  InputLabel,
  FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { useLocation } from "react-router-dom";
import { doc, updateDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../config/db";
import { useLiveQuery } from "dexie-react-hooks";

import "./list-of-requests.scss";

async function pickUpRequest(estimatedTime, parentId, id) {
  const fireStore = getFirestore();
  const auth = getAuth();
  const requestRef = doc(fireStore, "users", parentId, "requests", id);
  await updateDoc(requestRef, {
    estimatedTime: estimatedTime,
    technicianInCharge: auth.currentUser.email,
    status: "In progress",
  });
}

async function changeEstimatedCompletion(estimatedTime, parentId, id) {
  const fireStore = getFirestore();
  const requestRef = doc(fireStore, "users", parentId, "requests", id);
  await updateDoc(requestRef, {
    estimatedTime: estimatedTime,
  });
}

async function changeTechnicianInCharge(technicianInCharge, parentId, id) {
  const fireStore = getFirestore();
  const requestRef = doc(fireStore, "users", parentId, "requests", id);
  await updateDoc(requestRef, {
    technicianInCharge: technicianInCharge,
  });
}

async function changeStatus(status, parentId, id) {
  const fireStore = getFirestore();
  const requestRef = doc(fireStore, "users", parentId, "requests", id);
  await updateDoc(requestRef, {
    status: status,
  });
}

async function sendToSupervisor(parentId, id) {
  const fireStore = getFirestore();
  const auth = getAuth();
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
  const [position, setPosition] = useState("");
  const pos = useLiveQuery(() => db.users.toArray());

  useEffect(() => {
    if (!pos || !pos[0] || !pos[0].position) return;
    setPosition(pos[0].position);
  }, [pos]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEstimatedTime(null);
  };

  const [approvalOpen, setApprovalOpen] = useState(false);
  const handleApprovalOpen = () => setApprovalOpen(true);
  const handleApprovalClose = () => setApprovalOpen(false);

  const [statusOpen, setStatusOpen] = useState(false);
  const handleStatusOpen = () => setStatusOpen(true);
  const handleStatusClose = () => setStatusOpen(false);

  const [technicianOpen, setTechnicianOpen] = useState(false);
  const handleTechnicianOpen = () => setTechnicianOpen(true);
  const handleTechnicianClose = () => {
    setTechnicianOpen(false);
    setTICError(null);
  };

  const [estimatedCompletion, setEstimatedCompletionOpen] = useState(false);
  const handleEstimatedCompletionOpen = () => setEstimatedCompletionOpen(true);
  const handleEstimatedCompletionClose = () => {
    setEstimatedCompletionOpen(false);
  };

  const { state } = useLocation();
  const { id, supervisor, estimatedTime: eTime } = state.data;
  const { parentId, prevPage } = state;
  const [status, setStatus] = useState(state.data.status);
  const [technicianInCharge, setTechnicianInCharge] = useState(
    state.data.technicianInCharge
  );
  const [estimatedTime, setEstimatedTime] = useState(
    eTime ? new Date(eTime.seconds * 1000) : null
  );

  const [TICError, setTICError] = useState(null);
  const [tempTIC, setTempTIC] = useState(null);
  const [tempStatus, setTempStatus] = useState(state.data.status);
  const [tempEstimatedTime, setTempEstimatedTime] = useState(
    eTime ? new Date(eTime.seconds * 1000) : null
  );

  function checkDetails() {
    let change = true;
    if (!tempTIC) {
      setTICError("Please enter tecnician's email address");
      change = false;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(tempTIC)) {
      setTICError("Please enter a valid email address");
      change = false;
    }

    return change;
  }
  return (
    <div>
      <Navbar />
      <div className="box">
        <div className="page-title">Review Request</div>
        <div className="white-container">
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <div className="back-button">
                <BackButton pageTitle={prevPage} />
              </div>
            </Grid>
            <Grid item xs={11}>
              <MainRequestDetails />
              <SupervisorDetails />
              <h2>Technician Details</h2>
              <List className="request-details">
                {status !== "Pending approval" &&
                status !== "Waiting on technician" ? (
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
                    <div className="tech-details-item">
                      <b>Technician in charge:</b> {technicianInCharge}
                    </div>
                  </ListItem>
                ) : undefined}
                <ListItem
                  disablePadding
                  secondaryAction={
                    status !== "Pending approval" &&
                    status !== "Waiting on technician" ? (
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
                  <div className="tech-details-item">
                    <b>Status:</b> {status}
                  </div>
                </ListItem>
                {status !== "Pending approval" &&
                status !== "Waiting on technician" ? (
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
                    <div className="tech-details-item">
                      <b>Estimated completion date: </b>
                      {estimatedTime.toLocaleDateString()}
                    </div>
                  </ListItem>
                ) : undefined}
              </List>
              {status !== "Pending approval" &&
              status !== "Waiting on technician" ? (
                <MaterialsTable parentId={parentId} />
              ) : undefined}
              {status !== "Pending approval" &&
              status !== "Waiting on technician" ? (
                <CommentsTable parentId={parentId} />
              ) : undefined}
              {status === "Waiting on technician" ? (
                <div className="buttons">
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
                </div>
              ) : undefined}
              {position === "Technician" && (
                <DeleteRequest userID={parentId} requestID={id} />
              )}
            </Grid>
          </Grid>
        </div>
      </div>

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
              minDate={new Date()}
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
              disabled={!estimatedTime}
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
            value={supervisor}
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
            Change Estimated Time of Completion
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Please select date:
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              minDate={new Date()}
              label="Completion date"
              size="small"
              value={tempEstimatedTime}
              onChange={(newValue) => {
                setTempEstimatedTime(newValue);
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
                setEstimatedTime(tempEstimatedTime);
                changeEstimatedCompletion(tempEstimatedTime, parentId, id);
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
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Please select status:
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Status *</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={tempStatus}
              label="Status * "
              onChange={(e) => {
                setTempStatus(e.target.value);
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
                setStatus(tempStatus);
                changeStatus(tempStatus, parentId, id);
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
        onClose={handleTechnicianClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-style-bigger">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Change Technician
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Enter another technician's email address:
          </Typography>
          <TextField
            id="outlined-basic"
            label="Email address"
            variant="outlined"
            size="small"
            required
            value={tempTIC}
            error={TICError !== null}
            onChange={(e) => {
              setTICError(null);
              setTempTIC(e.target.value);
            }}
            helperText={TICError}
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
                if (checkDetails()) {
                  setTechnicianInCharge(tempTIC);
                  changeTechnicianInCharge(tempTIC, parentId, id);
                  setTempTIC(null);
                  handleTechnicianClose();
                }
              }}
            >
              Save
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
