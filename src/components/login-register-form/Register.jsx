import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import logo from "../../images/logo.png";
import Select from "@mui/material/Select";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";

import "./login-register-style.scss";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [position, setPosition] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSignup = () => {
    const db = getFirestore();
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setDoc(doc(db, "users", auth.currentUser.uid), {
          firstname: firstname,
          lastname: lastname,
          position: position,
        });
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/email-already-exists":
            setEmailError("Account on this email already exists");
            break;
          case "auth/invalid-email":
            setEmailError("Email is invalid");
            break;
          case "auth/invalid-password":
            setPasswordError("Password is incorrect");
            break;
        }
      });
  };

  const handleChange = (event) => {
    setPosition(event.target.value);
  };
  return (
    <div className="container">
      <div className="image">
        <img src={logo} alt="" />
      </div>
      <div className="title">Technical Request System</div>
      <div className="header">Sign Up</div>
      <div className="content">
        <div className="form">
          <TextField
            className="form-group"
            id="outlined-basic"
            label="First Name"
            variant="outlined"
            size="small"
            required
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Last Name"
            variant="outlined"
            size="small"
            required
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Email"
            variant="outlined"
            required
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Password"
            variant="outlined"
            required
            type="password"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Confirm Password"
            variant="outlined"
            type="password"
            size="small"
            required
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          <FormControl size="small" fullWidth>
            <InputLabel id="demo-simple-select-label">Position</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={position}
              label="Position"
              onChange={handleChange}
            >
              <MenuItem
                value={"Client"}
                onClick={(e) => setPosition(e.target.value)}
              >
                Client
              </MenuItem>
              <MenuItem
                value={"Supervisor"}
                onClick={(e) => setPosition(e.target.value)}
              >
                Supervisor
              </MenuItem>
              <MenuItem
                value={"Technician"}
                onClick={(e) => setPosition(e.target.value)}
              >
                Technician
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div className="footer">
        <Button variant="contained" size="lg" onClick={() => handleSignup()}>
          Sign Up
        </Button>
      </div>
    </div>
  );
}
