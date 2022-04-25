import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button, Box, Modal, Link, Typography } from "@mui/material";
import logo from "../../images/logo.png";
import { db } from "../../config/db";
import { initPosition } from "../../config/constants";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import "./login-register-style.scss";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email.toLowerCase(), password)
      .then(async () => {
        try {
          const userDoc = await initPosition();
          const { position, firstname, lastname, isAdmin } = userDoc.data();
          await db.table("users").add({
            userId: userDoc.id,
            position,
            email: email.toLowerCase(),
            firstname,
            lastname,
            isAdmin,
          });
        } catch (error) {
          console.log("Dexie Error: ", error);
        }
      })
      .catch((err) => {
        console.log("Error: ", err.code);
        if (!password) setPasswordError("Password is invalid");
        if (err.code === "auth/invalid-email")
          setEmailError("Email is invalid");
        if (err.code === "auth/user-not-found") setEmailError("User not found");
        if (err.code === "auth/wrong-password")
          setPasswordError("Password is incorrect");
      });
  };

  function resetPassword() {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email.toLowerCase())
      .then(() => {
        alert("Password reset email has been sent - please check your inbox");
      })
      .catch((error) => {
        console.log("error ", error);
      });
  }

  function checkEmail() {
    let proceed = true;
    if (!email) {
      setEmailError("Please enter email");
      proceed = false;
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email address");
      proceed = false;
    }
    return proceed;
  }

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const handleConfirmationOpen = () => setConfirmationOpen(true);
  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    setEmailError("");
    setEmail("");
  };

  return (
    <div>
      <form className="container" onSubmit={handleLogin}>
        <div className="image">
          <img src={logo} alt="" />
        </div>
        <h1 className="title">Request Management System</h1>
        <h2 className="login-header">Sign In</h2>
        <div className="content">
          <div className="form">
            <TextField
              className="form-group"
              id="email"
              label="Email"
              variant="outlined"
              required
              error={emailError !== ""}
              size="small"
              value={email}
              onChange={(e) => {
                setEmailError("");
                setEmail(e.target.value);
              }}
              helperText={emailError}
            />
            <TextField
              className="form-group"
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              required
              error={passwordError !== ""}
              size="small"
              value={password}
              onChange={(e) => {
                setPasswordError("");
                setPassword(e.target.value);
              }}
              helperText={passwordError}
            />
          </div>
        </div>
        <Link
          className="forgot-password-link"
          onClick={() => handleConfirmationOpen()}
        >
          Forgot password?
        </Link>
        <div className="footer">
          <Button variant="contained" size="lg" type="submit">
            Sign In
          </Button>
        </div>
      </form>

      {/* Reset password */}
      <Modal
        open={confirmationOpen}
        onClose={() => {
          handleConfirmationClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-style">
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Enter your email to reset password
          </Typography>
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Email"
            variant="outlined"
            required
            error={emailError !== ""}
            size="small"
            value={email}
            onChange={(e) => {
              setEmailError("");
              setEmail(e.target.value);
            }}
            helperText={emailError}
          />
          <div className="modal-buttons">
            <div className="request-form-button">
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  handleConfirmationClose();
                }}
              >
                Cancel
              </Button>
            </div>
            <Button
              variant="outlined"
              onClick={() => {
                if (checkEmail()) {
                  try {
                    resetPassword();
                  } catch (error) {
                    console.log(error);
                  } finally {
                    handleConfirmationClose();
                  }
                }
              }}
            >
              Reset password
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
