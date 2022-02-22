import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import BackButton from "../small-components/BackButton";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Button,
  Box,
  Typography,
  TextField,
  Modal,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import {
  collectionGroup,
  query,
  where,
  getDocs,
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  collection,
} from "firebase/firestore";
import { useLiveQuery } from "dexie-react-hooks";
import { db as dexieDB } from "../../config/db";

export default function ListOfTechncians() {
  let navigate = useNavigate();
  const users = useLiveQuery(() => dexieDB.users.toArray());

  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const [admin, setAdmin] = useState(null);
  const [tempEmail, setTempEmail] = useState(null);

  const [setupCode, setSetupCode] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [waitingToJoin, setWaitingToJoin] = useState([]);

  const [confirmation, setConfirmation] = useState(false);
  const confirmationOpen = () => setConfirmation(true);
  const confirmationClose = () => {
    setEmail("");
    setEmailError(null);
    setConfirmation(false);
  };

  const [confirmAdmin, setConfirmAdmin] = useState(null);
  const confirmAdminOpen = () => setConfirmAdmin(true);
  const confirmAdminClose = () => setConfirmAdmin(false);

  useEffect(() => {
    (async () => {
      try {
        const querySnapshot = await getDocs(
          query(
            collectionGroup(getFirestore(), "users"),
            where("position", "==", "Technician")
          )
        );
        let techArr = [];
        querySnapshot.forEach((document) => {
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
      } catch (error) {
        console.log(error);
      }
    })();
  }, [technicians]);

  useEffect(() => {
    (async () => {
      try {
        const querySnapshot = await getDocs(
          query(collectionGroup(getFirestore(), "technicians"))
        );
        let array = [];
        querySnapshot.forEach((document) => {
          array.push({
            data: document.data(),
          });
        });
        setWaitingToJoin(array);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [waitingToJoin]);

  async function addNewTechnician() {
    let add = true;

    if (!email) {
      setEmailError("Please enter email");
      add = false;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      add = false;
    }
    if (!add) return;

    let code = `SETUP${Date.now().toString()}`;
    setSetupCode(code);

    const db = getFirestore();
    await setDoc(doc(db, "technicians", code), {
      email: email,
      code: code,
    });

    confirmationOpen();
  }

  async function changeAdmin(newAdminEmail) {
    // Set current admin's status to false
    const fireStore = getFirestore();
    let requestRef = doc(fireStore, "users", admin.id);
    updateDoc(requestRef, {
      isAdmin: false,
    });
    // Set the current logged-in user's local admin status to false
    dexieDB.users.update(users[0].id, { isAdmin: false });

    // Get the new admin's document
    const docArr = await getDocs(
      query(
        collection(getFirestore(), "users"),
        where("email", "==", newAdminEmail)
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
      <div className="box">
        <div className="page-title">Technicians</div>
        <div className="white-container">
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <div className="back-button">
                <BackButton pageTitle={"/home"} />
              </div>
            </Grid>
            <Grid item xs={11}>
              <h1>Technicians</h1>
              <h2>Administrator</h2>
              <p className="tech-item">
                Current Administrator: <b>{admin?.email}</b>
              </p>
              <h2>List Of Technicians</h2>
              {technicians.length > 0 ? (
                <List>
                  {technicians.map((tech) => (
                    <ListItem>
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
                      <div className="tech-item">
                        {tech.data.firstname} {tech.data.lastname} |{" "}
                        <b>{tech.data.email}</b>
                      </div>
                      {!tech.data.isAdmin && (
                        <Button
                          onClick={() => {
                            setTempEmail(tech.data.email);
                            confirmAdminOpen();
                          }}
                        >
                          Make admin
                        </Button>
                      )}
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
                  addNewTechnician();
                }}
              >
                Add
              </Button>

              <h3>Waiting to join the system</h3>
              {waitingToJoin.length > 0 ? (
                <List>
                  {waitingToJoin.map((user) => (
                    <ListItem>
                      <div className="tech-item">
                        {user.data.email}| Set-up code: <b>{user.data.code}</b>
                      </div>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <p>No one is waiting to join.</p>
              )}
            </Grid>
          </Grid>
        </div>
      </div>

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
            Set up code is: {setupCode}
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
            Would you like to give administrator rights to <b>{tempEmail}</b>?
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
                changeAdmin(tempEmail);
                alert("Admin was successfully changed");
                navigate("/home");
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
