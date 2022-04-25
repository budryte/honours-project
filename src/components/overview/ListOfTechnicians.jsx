import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import PersonIcon from "@mui/icons-material/Person";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Typography,
  TextField,
  Modal,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  IconButton,
  Grid,
} from "@mui/material";
import {
  query,
  where,
  getDocs,
  getDoc,
  getFirestore,
  doc,
  updateDoc,
  collection,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { useLiveQuery } from "dexie-react-hooks";
import { db as dexieDB } from "../../config/db";

export default function ListOfTechncians() {
  let navigate = useNavigate();
  const user = useLiveQuery(() =>
    dexieDB.table("users").toCollection().first()
  );

  const [email, setEmail] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [emailError, setEmailError] = useState(null);

  const [admin, setAdmin] = useState(null);
  const [tempAdmin, setTempAdmin] = useState(null);

  const [technicians, setTechnicians] = useState([]);
  const [waitingToJoin, setWaitingToJoin] = useState([]);

  const [confirmation, setConfirmation] = useState(false);
  const confirmationOpen = () => setConfirmation(true);
  const confirmationClose = () => {
    setEmail("");
    setEmailError(null);
    setConfirmation(false);
  };

  const [removeOpen, setRemoveOpen] = useState(false);
  const handleRemoveOpen = () => setRemoveOpen(true);
  const handleRemoveClose = () => {
    setRemoveOpen(false);
    setEmail("");
  };

  const [confirmAdmin, setConfirmAdmin] = useState(false);
  const confirmAdminOpen = () => setConfirmAdmin(true);
  const confirmAdminClose = () => setConfirmAdmin(false);

  useEffect(() => {
    let isCancelled = false;
    const db = getFirestore();

    getDocs(
      query(collection(db, "users"), where("position", "==", "Technician"))
    )
      .then((snap) => {
        if (isCancelled) return;

        let techArr = [];
        snap.forEach((document) => {
          techArr.push({
            id: document.id,
            data: document.data(),
          });
          if (document.data().isAdmin)
            setAdmin({
              id: document.id,
              data: document.data(),
              email: document.data().email,
            });
        });
        setTechnicians(techArr);
      })
      .catch(console.warn);

    return () => (isCancelled = true);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const db = getFirestore();
    const techniciansDoc = doc(db, "metadata", "technicians");

    getDoc(techniciansDoc)
      .then((snap) => snap.data())
      .then((data) => data.waiting)
      .then((waiting) => {
        if (isCancelled || waiting.length === 0) return;
        setWaitingToJoin(waiting);
      })
      .catch(console.warn);

    return () => (isCancelled = true);
  }, []);

  function checkEmail() {
    let add = true;
    if (!email) {
      setEmailError("Please enter email");
      add = false;
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email address");
      add = false;
    }
    return add;
  }

  function addNewTechnician() {
    const db = getFirestore();
    try {
      const techniciansDoc = doc(db, "metadata", "technicians");
      return updateDoc(techniciansDoc, {
        waiting: arrayUnion(email.toLowerCase()),
      });
    } catch (error) {
      console.warn(error);
    }
  }

  function deleteTechnician() {
    const db = getFirestore();
    const techniciansDoc = doc(db, "metadata", "technicians");
    return updateDoc(techniciansDoc, {
      waiting: arrayRemove(email.toLowerCase()),
    });
  }

  async function changeAdmin(newAdminEmail) {
    // Set current admin's status to false
    const fireStore = getFirestore();
    let requestRef = doc(fireStore, "users", admin.id);
    updateDoc(requestRef, {
      isAdmin: false,
    });
    // Set the current logged-in user's local admin status to false
    dexieDB.table("users").update(user.id, { isAdmin: false });

    // Get the new admin's document
    const docArr = await getDocs(
      query(
        collection(getFirestore(), "users"),
        where("email", "==", newAdminEmail.toLowerCase())
      )
    );
    const newAdmin = docArr.docs[0];

    // Set the new admin's status to true
    requestRef = doc(fireStore, "users", newAdmin.id);
    updateDoc(requestRef, {
      isAdmin: true,
    });
  }

  return (
    <div>
      <Navbar />
      <main className="box">
        <h1 className="page-title">Technicians</h1>
        <div className="white-container-account">
          <h1>Manage Technicians</h1>
          <h2>Administrator</h2>
          <p className="tech-item">
            Current Administrator: <b>{admin?.email}</b>
          </p>
          <h2>List Of Technicians</h2>
          {technicians.length > 0 ? (
            <List>
              {technicians.map((tech) => (
                <ListItem key={tech.data.email}>
                  <ListItemAvatar>
                    <Avatar
                      style={{
                        backgroundColor: tech.data.isAdmin
                          ? "#4365e2"
                          : undefined,
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <Grid container>
                    <Grid item md={6} sm={12}>
                      <div className="tech-item">
                        {tech.data.firstname} {tech.data.lastname} |{" "}
                        <b>{tech.data.email}</b>
                      </div>
                    </Grid>
                    <Grid item md={6} sm={12}>
                      {!tech.data.isAdmin && (
                        <Button
                          onClick={() => {
                            setTempAdmin(tech.data.email.toLowerCase());
                            confirmAdminOpen();
                          }}
                        >
                          Make admin
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </List>
          ) : (
            <p>There are no technicians.</p>
          )}

          <h2>Add new technician</h2>
          <div className="add-new-technician">
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              required
              size="small"
              error={emailError !== null}
              value={email}
              onChange={(e) => {
                setEmailError(null);
                setEmail(e.target.value);
              }}
              helperText={emailError}
            />
          </div>
          <Button
            variant="contained"
            onClick={() => {
              if (checkEmail()) {
                addNewTechnician()
                  .then(() => {
                    setWaitingToJoin((p) => [...p, email.toLowerCase()]);
                  })
                  .catch((err) => {
                    console.warn(err);
                    alert("Could not add technician to Firestore");
                  })
                  .finally(confirmationOpen);
              }
            }}
          >
            Add
          </Button>

          <h3>Waiting to join the system</h3>
          {waitingToJoin.length > 0 ? (
            <List>
              {waitingToJoin.map((userEmail) => (
                <ListItem key={userEmail}>
                  <IconButton
                    onClick={() => {
                      setEmail(userEmail.toLowerCase());
                      setTempEmail(userEmail.toLowerCase());
                      handleRemoveOpen();
                    }}
                  >
                    <DeleteOutlineIcon
                      aria-label="delete technician waiting in line"
                      className="bin"
                    />
                  </IconButton>
                  <div className="tech-item">{userEmail}</div>
                </ListItem>
              ))}
            </List>
          ) : (
            <p>There are no waiting technicians.</p>
          )}
        </div>
      </main>

      {/* Add new technician confirmation */}
      <Modal
        open={confirmation}
        onClose={() => {
          navigate("/overview");
          confirmationClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-style">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Confirmation
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            New technician added successfully. <br></br>
          </Typography>
          <div className="modal-buttons">
            <div className="request-form-button">
              <Button
                variant="outlined"
                onClick={() => {
                  confirmationClose();
                }}
              >
                OK
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Remove technician */}
      <Modal
        open={removeOpen}
        onClose={() => {
          navigate("/overview");
          handleRemoveClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-style">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Confirmation
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Would you like to remove <b>{tempEmail}</b> from the waiting list?
          </Typography>
          <div className="modal-buttons">
            <div className="request-form-button">
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  handleRemoveClose();
                }}
              >
                Cancel
              </Button>
            </div>
            <Button
              variant="outlined"
              onClick={() => {
                deleteTechnician()
                  .then(() => {
                    setWaitingToJoin((p) => {
                      let pp = [...p];
                      pp.splice(pp.indexOf(email.toLowerCase()), 1);
                      return pp;
                    });
                    alert(
                      "Techncian was successfully removed from the waiting list"
                    );
                  })
                  .catch((err) => {
                    console.warn(err);
                    alert("Could not remove technician from Firestore");
                  })
                  .finally(handleRemoveClose);
              }}
            >
              OK
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Change admin confirmation */}
      <Modal
        open={confirmAdmin}
        onClose={() => {
          navigate("/overview");
          confirmAdminClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-style">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Confirmation
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Would you like to give administrator rights to <b>{tempAdmin}</b>?
          </Typography>
          <div className="modal-buttons">
            <div className="request-form-button">
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  navigate("/overview");
                  confirmAdminClose();
                }}
              >
                Cancel
              </Button>
            </div>
            <Button
              variant="outlined"
              color="success"
              onClick={() => {
                changeAdmin(tempAdmin);
                alert("Admin was successfully changed");
                navigate("/");
              }}
            >
              Yes
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
