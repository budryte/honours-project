import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import logo from "../../images/logo.png";
import { db } from "../../config/db";
import { initPosition } from "../../config/constants";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import "./login-register-style.scss";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        try {
          let { position, firstname, lastname } = await initPosition();
          await db.users.add({ position, email, firstname, lastname });
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

  return (
    <form className="container" onSubmit={handleLogin}>
      <div className="image">
        <img src={logo} alt="" />
      </div>
      <div className="title">Technical Request System</div>
      <div className="header">Sign In</div>
      <div className="content">
        <div className="form">
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
          <TextField
            className="form-group"
            id="outlined-basic"
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
      <div className="footer">
        <Button variant="contained" size="lg" type="submit">
          Sign In
        </Button>
      </div>
    </form>
  );
}
