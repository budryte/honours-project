import React from "react";
import { Button } from "native-base";
import logo from "../../images/logo.png";

export class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <div className="image">
          <img src={logo} alt="" />
        </div>
        <div className="title">Technical Request System</div>
        <div className="header">Login</div>
        <div className="content">
          <div className="form">
            <div className="form-group">
              <label>Email</label>
              <input type="text" name="email"></input>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="text" name="password"></input>
            </div>
          </div>
        </div>
        <div className="footer">
          <Button size="lg">Login</Button>
        </div>
      </div>
    );
  }
}
