import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

import logo from "../../images/logo.png";
import "./navbar.scss";

export default function Navbar(props) {
  //console.log("position: ", props.position);
  let navigate = useNavigate();

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut();
  };

  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      className="menu-drawer"
      role="presentation"
      //onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className="close-button">
        <CloseIcon fontSize="large" onClick={toggleDrawer(anchor, false)} />
      </div>
      <div className="image">
        <img src={logo} alt="" />
      </div>
      <List>
        <ListItem
          button
          style={{ "padding-left": "40px" }}
          onClick={() => {
            navigate("/home");
          }}
        >
          <ListItemText primary="Home" />
        </ListItem>

        <ListItem button style={{ "padding-left": "40px" }}>
          <ListItemText primary="My Account" />
        </ListItem>

        {props.position !== "Technician" && (
          <ListItem
            button
            style={{ "padding-left": "40px" }}
            onClick={() => {
              navigate("/agreement");
            }}
          >
            <ListItemText primary="New Request" />
          </ListItem>
        )}

        {props.position !== "Technician" && (
          <ListItem
            button
            style={{ "padding-left": "40px" }}
            onClick={() => {
              navigate("/track-requests");
            }}
          >
            <ListItemText primary="Track Request" />
          </ListItem>
        )}

        {props.position === "Supervisor" && (
          <ListItem
            button
            style={{ "padding-left": "40px" }}
            onClick={() => {
              navigate("/pending-requests");
            }}
          >
            <ListItemText primary="Pending Requests" />
          </ListItem>
        )}

        {props.position === "Technician" && (
          <ListItem button style={{ "padding-left": "40px" }}>
            <ListItemText primary="List of Requests" />
          </ListItem>
        )}

        {props.position === "Technician" && (
          <ListItem button style={{ "padding-left": "40px" }}>
            <ListItemText primary="My Work" />
          </ListItem>
        )}

        <ListItem button style={{ "padding-left": "40px" }}>
          <ListItemText primary="My Archive" />
        </ListItem>
      </List>

      <Divider />
      <List>
        <ListItem
          button
          style={{ "padding-left": "40px" }}
          onClick={handleLogout}
        >
          <ListItemText style={{ "font-weight": "bold" }} primary="Log Out" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <MenuIcon
            className="hamburger"
            fontSize="large"
            onClick={toggleDrawer(anchor, true)}
          >
            {anchor}
          </MenuIcon>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
