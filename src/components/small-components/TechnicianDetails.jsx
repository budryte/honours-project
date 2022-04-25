import React, { useState } from "react";
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
  InputLabel,
  FormControl,
  Tooltip,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { doc, updateDoc, getFirestore } from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

export default function TechnicianDetails(props) {
  const position = props.position;

  const { state } = useLocation();
  const { id, pickupDate, estimatedTime: eTime, userId: parentId } = state.data;

  const [status, setStatus] = useState(state.data.status);
  const [technicianInCharge, setTechnicianInCharge] = useState(
    state.data.technicianInCharge
  );
  const [TICError, setTICError] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(
    eTime ? new Date(eTime.seconds * 1000) : null
  );

  //temporary variables
  const [tempTIC, setTempTIC] = useState(null);
  const [tempStatus, setTempStatus] = useState(state.data.status);
  const [tempEstimatedTime, setTempEstimatedTime] = useState(
    eTime ? new Date(eTime.seconds * 1000) : null
  );

  //changing technician in charge
  const [technicianOpen, setTechnicianOpen] = useState(false);
  const handleTechnicianOpen = () => setTechnicianOpen(true);
  const handleTechnicianClose = () => {
    setTechnicianOpen(false);
    setTempTIC(null);
    setTICError(null);
  };

  //change technician in charge on Firebase
  function changeTechnicianInCharge() {
    const fireStore = getFirestore();
    const requestRef = doc(fireStore, "users", parentId, "requests", id);

    return updateDoc(requestRef, {
      technicianInCharge: tempTIC,
    });
  }

  //checking technician's email
  function checkDetails() {
    let change = true;
    if (!tempTIC) {
      setTICError("Please enter tecnician's email address");
      change = false;
    } else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(tempTIC)
    ) {
      setTICError("Please enter a valid email address");
      change = false;
    }

    return change;
  }

  //estimating time of completion
  const [estimatedCompletion, setEstimatedCompletionOpen] = useState(false);
  const handleEstimatedCompletionOpen = () => setEstimatedCompletionOpen(true);
  const handleEstimatedCompletionClose = () => {
    setEstimatedCompletionOpen(false);
  };

  //change estimated completion time on Firebase
  async function changeEstimatedCompletion() {
    const fireStore = getFirestore();
    const requestRef = doc(fireStore, "users", parentId, "requests", id);
    await updateDoc(requestRef, {
      estimatedTime: tempEstimatedTime,
    });
  }

  //changing the status of the request
  const [statusOpen, setStatusOpen] = useState(false);
  const handleStatusOpen = () => setStatusOpen(true);
  const handleStatusClose = () => setStatusOpen(false);

  const statusValues = [
    "Waiting on materials",
    "In progress",
    "Waiting to be collected",
    "Completed",
  ];

  //change request status on Firebase
  function changeStatus() {
    const fireStore = getFirestore();
    const requestRef = doc(fireStore, "users", parentId, "requests", id);
    return updateDoc(requestRef, {
      status: tempStatus,
    });
  }

  function isEditingAllowed() {
    return position === "Technician" && status !== "Completed";
  }

  return (
    <div>
      <h2>Technician Details</h2>
      <List className="request-details">
        {!!pickupDate ? (
          <ListItem disablePadding>
            <div className="tech-details-item">
              <b>Request picked-up on: </b>
              {new Date(pickupDate.seconds * 1000).toLocaleDateString()}
            </div>
          </ListItem>
        ) : undefined}
        <ListItem
          disablePadding
          secondaryAction={
            isEditingAllowed() && (
              <Tooltip title="Edit Status">
                <IconButton
                  edge="end"
                  aria-label="change status"
                  onClick={() => {
                    handleStatusOpen();
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )
          }
        >
          <div className="tech-details-item">
            <b>Status:</b> {status}
          </div>
        </ListItem>
        {!!technicianInCharge ? (
          <ListItem
            disablePadding
            secondaryAction={
              isEditingAllowed() ? (
                <Tooltip title="Edit Technician">
                  <IconButton
                    edge="end"
                    aria-label="change technician"
                    onClick={() => {
                      handleTechnicianOpen();
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              ) : undefined
            }
          >
            <div className="tech-details-item">
              <b>Technician in charge:</b> {technicianInCharge}
            </div>
          </ListItem>
        ) : undefined}
        {!!estimatedTime ? (
          <ListItem
            disablePadding
            secondaryAction={
              isEditingAllowed() && (
                <Tooltip title="Edit Date">
                  <IconButton
                    edge="end"
                    aria-label="change estimated completion date"
                    onClick={() => {
                      handleEstimatedCompletionOpen();
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )
            }
          >
            <div className="tech-details-item">
              <b>Estimated completion date: </b>
              {estimatedTime.toLocaleDateString()}
            </div>
          </ListItem>
        ) : undefined}
      </List>

      {/* Modal to change estimated time of completion */}
      <Modal
        open={estimatedCompletion}
        onClose={handleEstimatedCompletionClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-style">
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
                changeEstimatedCompletion();
                handleEstimatedCompletionClose();
              }}
            >
              Save
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Modal to change status */}
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
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
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
                changeStatus()
                  .then(() => setStatus(tempStatus))
                  .catch(console.warn)
                  .finally(() => handleStatusClose());
              }}
            >
              Save
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Modal to change technician in charge */}
      <Modal
        open={technicianOpen}
        onClose={handleTechnicianClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-style">
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
                  changeTechnicianInCharge()
                    .then(() => {
                      setTechnicianInCharge(tempTIC);
                      handleTechnicianClose();
                    })
                    .catch((e) => {
                      console.warn(e);
                      alert(e);
                    });
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
