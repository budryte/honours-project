import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import BackButton from "../small-components/BackButton";
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
import { useLiveQuery } from "dexie-react-hooks";
import { db as dexieDB } from "../../config/db";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function changePassword(oldPassword, newPassword, confirmPassword) {
  const auth = getAuth();
}

export default function Account() {
  const users = useLiveQuery(() => dexieDB.users.toArray());
  const [email, setEmail] = useState(null);
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);

  const [changePassword, setChangePassword] = useState(false);
  const changePasswordOpen = () => setChangePassword(true);
  const changePasswordClose = () => setChangePassword(false);

  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  useEffect(() => {
    if (!users || !users[0] || !users[0].email) return;
    setEmail(users[0].email);
    setFirstname(users[0].firstname);
    setLastname(users[0].lastname);
  }, [users]);
  return (
    <div>
      <Navbar />
      <div className="box">
        <div className="page-title">My Account</div>
        <div className="white-container">
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <div className="back-button">
                <BackButton pageTitle={"/home"} />
              </div>
            </Grid>
            <Grid item xs={11}>
              <h1>Change Account Details</h1>
              <List className="request-details">
                <ListItem disablePadding>
                  <ListItemText>
                    <b>First Name:</b> {firstname}
                  </ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>
                    <b>Last Time:</b> {lastname}
                  </ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>
                    <b>Email address:</b> {email}
                  </ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>
                    <b>Password: </b> *******
                  </ListItemText>
                </ListItem>
              </List>
              <div className="buttons">
                <Button variant="outlined" onClick={() => changePasswordOpen()}>
                  Change password
                </Button>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>

      <Modal
        open={changePassword}
        onClose={changePasswordClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-style">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Change Password
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Enter Old Password:
          </Typography>
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Old Password"
            variant="outlined"
            required
            size="small"
            value={oldPassword}
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Enter New Password:
          </Typography>
          <TextField
            className="form-group"
            id="outlined-basic"
            label="New Password"
            variant="outlined"
            required
            size="small"
            value={newPassword}
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Confirm New Password:
          </Typography>
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Confirm Password"
            variant="outlined"
            required
            size="small"
            value={confirmPassword}
          />
          <div className="modal-buttons">
            <div className="request-form-button">
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  changePasswordClose();
                }}
              >
                Cancel
              </Button>
            </div>
            <Button
              variant="outlined"
              color="success"
              onClick={() => {
                setOldPassword(oldPassword);
                setNewPassword(newPassword);
                setConfirmPassword(confirmPassword);
                changePassword(oldPassword, newPassword, confirmPassword);
                changePasswordClose();
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
