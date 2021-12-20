import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import logo from "../../images/logo.png";

import "./style.scss";

export function Login(props) {
  const { email, setEmail, password, setPassword, handleLogin } = props;

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Password"
            type="password"
            variant="outlined"
            required
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="footer">
        <Button variant="contained" size="lg" onClick={() => handleLogin()}>
          Sign In
        </Button>
      </div>
    </div>
  );
}
