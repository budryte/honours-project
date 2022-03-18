import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import {
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
import { useNavigate } from "react-router-dom";
import { db as dexieDB } from "../../config/db";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";

export default function Account() {
  let navigate = useNavigate();
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

  const [deleteAcc, setDeleteAcc] = useState(false);
  const deleteAccOpen = () => setDeleteAcc(true);
  const deleteAccClose = () => {
    setOldPassword(null);
    setOldPasswordError(null);
    setDeleteAcc(false);
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
        alert("Password was changed successfully.");
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

  async function deleteAccount() {
    let proceed = true;
    const auth = getAuth();
    const user = auth.currentUser;

    if (!oldPassword) {
      setOldPasswordError("Please enter old password");
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

    deleteUser(user)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
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
      <main className="box">
        <h1 className="page-title">My Account</h1>
        <div className="white-container-account">
          <h2 style={{ marginTop: 0 }}>Account Details</h2>
          <List className="request-details">
            <ListItem disablePadding>
              <ListItemText>
                <b>First Name:</b> {firstname}
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText>
                <b>Last Name:</b> {lastname}
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
          <h2>Change password</h2>
          <p>Make sure it's at least 6 characters long</p>
          <Button variant="outlined" onClick={() => changePasswordOpen()}>
            Change password
          </Button>
          <h2>Delete account</h2>
          <p>
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <Button
            variant="outlined"
            color="error"
            onClick={() => deleteAccOpen()}
          >
            Delete account
          </Button>
        </div>
      </main>

      {/* change password modal */}
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
            Old password
          </Typography>
          <TextField
            className="form-group"
            id="old-password"
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
            New password
          </Typography>
          <TextField
            className="form-group"
            id="new-password"
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
            Confirm new password
          </Typography>
          <TextField
            className="form-group"
            id="confirm-password"
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

      {/* delete account modal */}
      <Modal
        open={deleteAcc}
        onClose={() => {
          navigate("/my-account");
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-style">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Deleting an account
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            If you would like to delete your account, please enter your password
          </Typography>
          <TextField
            className="form-group"
            id="password"
            label="Password"
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
          <div className="modal-buttons">
            <div className="request-form-button">
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  deleteAccClose();
                }}
              >
                Cancel
              </Button>
            </div>
            <Button
              variant="outlined"
              color="success"
              onClick={() => {
                deleteAccount();
              }}
            >
              Delete
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
