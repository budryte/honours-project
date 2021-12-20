import React from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import logo from "../../images/logo.png";
import Select from "@mui/material/Select";

import "./style.scss";

export function Register() {
  const [position, setPosition] = React.useState("");

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
            required
            size="small"
          />
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Last Name"
            variant="outlined"
            required
            size="small"
          />
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Email"
            variant="outlined"
            required
            size="small"
          />
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Password"
            variant="outlined"
            required
            size="small"
          />
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Confirm Password"
            variant="outlined"
            required
            size="small"
          />
          <FormControl fullWidth>
            <InputLabel>Position</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              size="small"
              value={position}
              label="Position"
              onChange={handleChange}
            >
              <MenuItem value={"Client"}>Client</MenuItem>
              <MenuItem value={"Supervisor"}>Supervisor</MenuItem>
              <MenuItem value={"Technician"}>Technician</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div className="footer">
        <Button variant="contained" size="lg">
          Sign Up
        </Button>
      </div>
    </div>
  );
}
