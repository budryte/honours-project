import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../components/navbar/Navbar";
import MainRequestDetails from "../components/small-components/MainRequestDetails";
import SupervisorDetails from "../components/small-components/SupervisorDetails";
import TechnicianDetails from "../components/small-components/TechnicianDetails";
import MaterialsTable from "../components/small-components/MaterialsTable";
import CommentsTable from "../components/small-components/CommentsTable";
import BackButton from "../components/small-components/BackButton";
import DeleteRequest from "../components/small-components/DeleteRequest";
import { Grid, Button, Box, Typography, TextField, Modal } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  doc,
  updateDoc,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../config/db";
import { useLiveQuery } from "dexie-react-hooks";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

export default function ReviewRequest() {
  const { state } = useLocation();
  const {
    id,
    status,
    supervisor,
    estimatedTime: eTime,
    userId: parentId,
  } = state.data;
  const { prevPage } = state;
  const [estimatedTime, setEstimatedTime] = useState(
    eTime ? new Date(eTime.seconds * 1000) : null
  );

  let navigate = useNavigate();

  //getting loged-in users's position
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState(null);
  const user = useLiveQuery(() => db.table("users").toCollection().first());

  useEffect(() => {
    if (!user) return;

    setPosition(user.position);
    setEmail(user.email);
  }, [user]);

  //changing page title
  const title = useMemo(() => {
    if (prevPage === "/archive") {
      return "Review Archived Request";
    } else if (prevPage === "/track-requests") {
      return "Review Tracked Request";
    } else if (prevPage === "/pending-requests") {
      return "Review Pending Request";
    } else if (prevPage === "/list-of-requests" || prevPage === "/my-work") {
      return "Review Request";
    }
  }, []);

  //signing request
  const [signingOpen, setSigningOpen] = useState(false);
  const handleSigningOpen = () => setSigningOpen(true);
  const handleSigningClose = () => {
    setSigningOpen(false);
  };

  const [grant, setGrant] = useState("");
  const [grantError, setGrantError] = useState(null);
  const [account, setAccount] = useState("");

  function checkGrant() {
    if (!/^(\d*[.])?\d+$/.test(grant)) {
      setGrantError("Please enter numerical values only");
      return false;
    }
    return true;
  }

  function addFields() {
    const firestore = getFirestore();
    const requestRef = doc(firestore, "users", parentId, "requests", id);

    return updateDoc(requestRef, {
      grant: grant,
      account: account,
      status: "Waiting on technician",
    });
  }

  //getting supervisor's approval
  const [approvalOpen, setApprovalOpen] = useState(false);
  const handleApprovalOpen = () => setApprovalOpen(true);
  const handleApprovalClose = () => setApprovalOpen(false);

  function sendToSupervisor() {
    const fireStore = getFirestore();
    const auth = getAuth();
    const requestRef = doc(fireStore, "users", parentId, "requests", id);

    return updateDoc(requestRef, {
      approvalRequired: "Yes",
      technicianInCharge: auth.currentUser.email,
      status: "Pending approval",
    });
  }

  //picking up the request
  const [pickupOpen, setPickupOpen] = useState(false);
  const handlePickupOpen = () => setPickupOpen(true);
  const handlePickupClose = () => {
    setPickupOpen(false);
    setEstimatedTime(null);
  };

  function pickUpRequest() {
    const fireStore = getFirestore();
    const auth = getAuth();
    const requestRef = doc(fireStore, "users", parentId, "requests", id);

    return updateDoc(requestRef, {
      estimatedTime: estimatedTime,
      technicianInCharge: auth.currentUser.email,
      status: "In progress",
      pickupDate: serverTimestamp(),
    });
  }

  return (
    <div>
      <Navbar />
      <main className="box">
        <h1 className="page-title">{title}</h1>
        <div className="white-container">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={1}>
              <BackButton pageTitle={prevPage} />
            </Grid>
            <Grid item xs={12} sm={11}>
              <MainRequestDetails />
              <SupervisorDetails />
              {status !== "Pending approval" &&
                status !== "Waiting on technician" && (
                  <>
                    <TechnicianDetails position={position} />
                    <MaterialsTable parentId={parentId} position={position} />
                    <CommentsTable
                      parentId={parentId}
                      position={position}
                      email={email}
                    />
                  </>
                )}
              <div className="buttons">
                <div className="request-form-button">
                  {(prevPage === "/list-of-requests" ||
                    prevPage === "/custom-search") &&
                  status === "Waiting on technician" ? (
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleApprovalOpen();
                      }}
                    >
                      Send to Supervisor
                    </Button>
                  ) : undefined}
                  {(prevPage === "/pending-requests" ||
                    prevPage === "/custom-search") &&
                  position === "Supervisor" ? (
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleSigningOpen();
                      }}
                    >
                      Approve
                    </Button>
                  ) : undefined}
                </div>
                {(prevPage === "/list-of-requests" ||
                  prevPage === "/custom-search") &&
                status === "Waiting on technician" ? (
                  <Button
                    variant="contained"
                    onClick={() => {
                      handlePickupOpen();
                    }}
                  >
                    Pick Up Request
                  </Button>
                ) : undefined}
              </div>
              {position === "Technician" ||
              (prevPage === "/track-requests" &&
                status === "Pending approval") ? (
                <DeleteRequest
                  userID={parentId}
                  requestID={id}
                  status={status}
                  prevPage={prevPage}
                />
              ) : undefined}
            </Grid>
          </Grid>
        </div>
      </main>

      {/* Sign request modal */}
      <Modal
        open={signingOpen}
        onClose={handleSigningClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-style">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Approve Request
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Enter account to be charged*:
          </Typography>
          <TextField
            className="form-group"
            id="account-to-be-charged"
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
            id="grant"
            label="Grant"
            variant="outlined"
            size="small"
            required
            error={grantError !== null}
            value={grant}
            onChange={(e) => {
              setGrant(e.target.value);
              setGrantError(null);
            }}
            helperText={grantError}
          />
          <div className="modal-buttons">
            <div className="request-form-button">
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  handleSigningClose();
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
                if (!checkGrant()) return;

                addFields()
                  .catch(console.warn)
                  .finally(() => {
                    alert("The request was signed and sent successfully.");
                    navigate("/pending-requests");
                    handleSigningClose();
                  });
              }}
            >
              Approve
            </Button>
          </div>
          <p style={{ fontSize: "12px" }}>
            * If you do not know the approved School's account, please add any
            information (i.e. your School name) that would help us to identify
            the account to be charged.
          </p>
        </Box>
      </Modal>

      {/* Pick up request */}
      <Modal
        open={pickupOpen}
        onClose={handlePickupClose}
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
                  handlePickupClose();
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
                pickUpRequest()
                  .catch(console.warn)
                  .finally(() => {
                    alert("Request was successfully picked up");
                    navigate("/list-of-requests");
                    handlePickupClose();
                  });
              }}
            >
              Pick Up
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
        <Box className="modal-style">
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
                sendToSupervisor()
                  .catch(console.warn)
                  .finally(() => {
                    alert("Request was successfully sent to supervisor");
                    navigate("/list-of-requests");
                    handleApprovalClose();
                  });
              }}
            >
              Send
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
