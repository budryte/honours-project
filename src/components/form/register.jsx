import React from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import logo from "../../images/logo.png";
import Select from "@mui/material/Select";

import "./style.scss";

export function Register(props) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleSignup,
    firstname,
    setFirstname,
    lastname,
    setLastname,
    position,
    setPosition,
  } = props;

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
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Last Name"
            variant="outlined"
            size="small"
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
          />
          <FormControl fullWidth>
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
