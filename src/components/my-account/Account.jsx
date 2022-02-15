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
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

export default function Account() {
  const users = useLiveQuery(() => dexieDB.users.toArray());
  const [email, setEmail] = useState(null);
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);

  const [changePassword, setChangePassword] = useState(false);
  const changePasswordOpen = () => setChangePassword(true);
  const changePasswordClose = () => {
    setNewPassword(null);
    setConfirmPassword(null);
    setOldPassword(null);
    setOldPasswordError(null);
    setNewPasswordError(null);
    setConfirmPasswordError(null);
    setChangePassword(false);
  };

  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  const [oldPasswordError, setOldPasswordError] = useState(null);
  const [newPasswordError, setNewPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  async function changePass() {
    const auth = getAuth();
    const user = auth.currentUser;
    let proceed = true;

    if (!oldPassword) {
      setOldPasswordError("Please enter old password");
      proceed = false;
    }
    if (!newPassword) {
      setNewPasswordError("Please enter new password");
      proceed = false;
    }
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm new password");
      proceed = false;
    } else if (newPassword !== confirmPassword) {
      setNewPasswordError("New passwords should match");
      setConfirmPasswordError("New passwords shoudld match");
      proceed = false;
    }

    const credential = EmailAuthProvider.credential(user.email, oldPassword);

    await reauthenticateWithCredential(user, credential)
      .then(() => {
        console.log("User re-authenticated.");
      })
      .catch((err) => {
        console.log("User not re-authenticated", err);
        if (err.code === "auth/wrong-password") {
          setOldPasswordError("Password is incorrect");
          proceed = false;
        }
      });

    if (!proceed) return;

    updatePassword(user, newPassword)
      .then(() => {
        console.log("Update successful.");
        changePasswordClose();
      })
      .catch((error) => {
        console.log("Password update failed", error);
        if (error.code === "auth/weak-password") {
          setNewPasswordError("Password should be at least 6 characters long");
          setConfirmPasswordError(
            "Password should be at least 6 characters long"
          );
        }
      });
  }

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
              <h1>Account Details</h1>
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
            type="password"
            size="small"
            error={oldPasswordError !== null}
            value={oldPassword}
            onChange={(e) => {
              setOldPasswordError(null);
              setOldPassword(e.target.value);
            }}
            helperText={oldPasswordError}
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
            type="password"
            size="small"
            error={newPasswordError !== null}
            value={newPassword}
            onChange={(e) => {
              setNewPasswordError(null);
              setNewPassword(e.target.value);
            }}
            helperText={newPasswordError}
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
            type="password"
            size="small"
            error={confirmPasswordError !== null}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPasswordError(null);
              setConfirmPassword(e.target.value);
            }}
            helperText={confirmPasswordError}
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
                changePass();
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
