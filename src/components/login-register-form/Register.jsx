import React, { useState } from "react";
import {
  TextField,
  InputLabel,
  FormControl,
  FormHelperText,
  MenuItem,
  Button,
} from "@mui/material";
import logo from "../../images/logo.png";
import Select from "@mui/material/Select";
import { db as dexieDB } from "../../config/db";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  getFirestore,
  deleteDoc,
} from "firebase/firestore";

import "./login-register-style.scss";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [position, setPosition] = useState("");
  const [code, setCode] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [positionError, setPositionError] = useState("");
  const [codeError, setCodeError] = useState("");

  const handleSignup = async (e) => {
    //prevent from refreshing page
    e.preventDefault();

    const db = getFirestore();
    const auth = getAuth();

    let createAccount = true;

    if (!password) {
      setPasswordError("Password is invalid");
      createAccount = false;
    }
    if (firstname === "") {
      setFirstnameError("Please enter your first name");
      createAccount = false;
    }
    if (lastname === "") {
      setLastnameError("Please enter your last name");
      createAccount = false;
    }
    if (position === "") {
      setPositionError("Please select position");
      createAccount = false;
    }
    if (position === "Technician" && code === "") {
      setCodeError("Please enter set-up code");
      createAccount = false;
    }
    if (password !== passwordConfirm) {
      setPasswordError("Passwords don't match");
      createAccount = false;
    }
    if (email === "") {
      setEmailError("Please enter your email address");
      createAccount = false;
    }
    if (position === "Technician") {
      await checkCode();
    }

    async function checkCode() {
      const docRef = doc(getFirestore(), "technicians", code);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setCodeError("Set up code is invalid");
        createAccount = false;
        return;
      }
      if (docSnap.data().email !== email) {
        setEmailError("Set-up code or email is incorrect");
        setCodeError("Set-up code or email is incorrect");
        createAccount = false;
        return;
      }
      try {
        deleteDoc(doc(getFirestore(), "technicians", code));
      } catch (error) {
        console.log(error);
      }
    }

    if (!createAccount) return;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        return setDoc(doc(db, "users", auth.currentUser.uid), {
          firstname: firstname,
          lastname: lastname,
          position: position,
          email: email,
          isAdmin: false,
          archivedRequests: 0,
        });
      })
      .then(async () => {
        try {
          await dexieDB.users.add({
            userId: auth.currentUser.uid,
            position,
            email,
            firstname,
            lastname,
            isAdmin: false,
          });
        } catch (error) {
          console.log("Dexie Error: ", error);
        }
      })
      .catch((err) => {
        console.log("err: ", err);
        if (err.code === "auth/email-already-in-use")
          setEmailError("Account on this email already exists");
        if (err.code === "auth/invalid-email")
          setEmailError("Email is invalid");
        if (err.code === "auth/wrong-password")
          setPasswordError("Password is incorrect");
        if (err.code === "auth/weak-password")
          setPasswordError("Password should be at least 6 characters");
      });
  };

  const handleChange = (event) => {
    setPosition(event.target.value);
  };

  return (
    <form className="container" onSubmit={handleSignup}>
      <div className="image">
        <img src={logo} alt="" />
      </div>
      <h1 className="title">Request Management System</h1>
      <h2 className="login-header">Sign Up</h2>
      <div className="content">
        <div className="form">
          <TextField
            className="form-group"
            id="firstname"
            label="First Name"
            variant="outlined"
            size="small"
            required
            value={firstname}
            error={firstnameError !== ""}
            onChange={(e) => {
              setFirstnameError("");
              setFirstname(e.target.value);
            }}
            helperText={firstnameError}
          />
          <TextField
            className="form-group"
            id="last-name"
            label="Last Name"
            variant="outlined"
            size="small"
            required
            error={lastnameError !== ""}
            value={lastname}
            onChange={(e) => {
              setLastnameError("");
              setLastname(e.target.value);
            }}
            helperText={lastnameError}
          />
          <TextField
            className="form-group"
            id="email"
            label="Email"
            variant="outlined"
            required
            size="small"
            error={emailError !== ""}
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
            variant="outlined"
            required
            type="password"
            size="small"
            error={passwordError !== ""}
            value={password}
            onChange={(e) => {
              setPasswordError("");
              setPassword(e.target.value);
            }}
            helperText={passwordError}
          />
          <TextField
            className="form-group"
            id="confirm-password"
            label="Confirm Password"
            variant="outlined"
            type="password"
            size="small"
            required
            error={passwordError !== ""}
            value={passwordConfirm}
            onChange={(e) => {
              setPasswordError("");
              setPasswordConfirm(e.target.value);
            }}
            helperText={passwordError}
          />
          <FormControl size="small" fullWidth error={positionError !== ""}>
            <InputLabel
              id={
                positionError !== ""
                  ? "demo-simple-select-error-label"
                  : "demo-simple-select-label"
              }
            >
              Position *
            </InputLabel>
            <Select
              labelId={
                positionError !== ""
                  ? "demo-simple-select-error-label"
                  : "demo-simple-select-label"
              }
              id={
                positionError !== ""
                  ? "demo-simple-select-error"
                  : "demo-simple-select"
              }
              value={position}
              label="Position *"
              error={positionError !== ""}
              onChange={handleChange}
            >
              <MenuItem
                value={"Client"}
                onClick={(e) => {
                  setPositionError("");
                  setPosition(e.target.value);
                }}
              >
                Client
              </MenuItem>
              <MenuItem
                value={"Supervisor"}
                onClick={(e) => {
                  setPositionError("");
                  setPosition(e.target.value);
                }}
              >
                Supervisor
              </MenuItem>
              <MenuItem
                value={"Technician"}
                onClick={(e) => {
                  setPositionError("");
                  setPosition(e.target.value);
                }}
              >
                Technician
              </MenuItem>
            </Select>
            <FormHelperText>{positionError}</FormHelperText>
          </FormControl>
          {position === "Technician" && (
            <TextField
              className="form-group-code"
              id="outlined-basic"
              label="Set-up code"
              variant="outlined"
              size="small"
              required
              error={codeError !== ""}
              value={code}
              onChange={(e) => {
                setCodeError("");
                setCode(e.target.value);
              }}
              helperText={codeError}
            />
          )}
        </div>
      </div>
      <div className="footer">
        <Button variant="contained" type="submit" size="lg">
          Sign Up
        </Button>
      </div>
    </form>
  );
}
