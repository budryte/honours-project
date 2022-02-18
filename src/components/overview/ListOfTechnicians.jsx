import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import BackButton from "../small-components/BackButton";
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
} from "@mui/material";
import {
  collectionGroup,
  query,
  where,
  getDocs,
  getFirestore,
  doc,
  setDoc,
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
  const [firstnameError, setFirstnameError] = useState(null);
  const [lastnameError, setLastnameError] = useState(null);

  const [setupCode, setSetupCode] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [waitingToJoin, setWaitingToJoin] = useState([]);

  const [confirmation, setConfirmation] = useState(false);
  const confirmationOpen = () => setConfirmation(true);
  const confirmationClose = () => {
    setEmail("");
    setFirstname("");
    setLastname("");
    setEmailError(null);
    setFirstnameError(null);
    setLastnameError(null);
    setConfirmation(false);
  };

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
            data: document.data(),
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

    if (!firstname) {
      setFirstnameError("Please enter first name");
      add = false;
    }
    if (!lastname) {
      setLastnameError("Please enter last name");
      add = false;
    }
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
      firstname: firstname,
      lastname: lastname,
      email: email,
      code: code,
    });

    confirmationOpen();
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
              <h1>List Of Technicians</h1>
              {technicians.length > 0 ? (
                <List>
                  {technicians.map((tech) => (
                    <ListItem>
                      <div className="tech-item">
                        {tech.data.firstname} {tech.data.lastname} |{" "}
                        <b>{tech.data.email}</b>
                      </div>
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
                  label="First Name"
                  variant="outlined"
                  required
                  size="small"
                  error={firstnameError !== null}
                  value={firstname}
                  onChange={(e) => {
                    setFirstnameError(null);
                    setFirstname(e.target.value);
                  }}
                  helperText={firstnameError}
                />
              </div>
              <div className="add-new-technician">
                <TextField
                  id="outlined-basic"
                  label="Last Name"
                  variant="outlined"
                  required
                  size="small"
                  error={lastnameError !== null}
                  value={lastname}
                  onChange={(e) => {
                    setLastnameError(null);
                    setLastname(e.target.value);
                  }}
                  helperText={lastnameError}
                />
              </div>
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
                        {user.data.firstname} {user.data.lastname} |{" "}
                        {user.data.email} <br></br>
                        Set-up code: <b>{user.data.code}</b>
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
    </div>
  );
}
