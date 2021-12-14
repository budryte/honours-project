import React from "react";
import { Button } from "native-base";
import TextField from "@mui/material/TextField";
import logo from "../../images/logo.png";

import "./style.scss";

export function Login() {
  return (
    <div className="container">
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
        </div>
      </div>
      <div className="footer">
        <Button size="lg">Sign In</Button>
      </div>
    </div>
  );
}
