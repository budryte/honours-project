import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "../../config/db";
import { useLiveQuery } from "dexie-react-hooks";

import logo from "../../images/logo.png";
import "./navbar.scss";

export default function Navbar() {
  let navigate = useNavigate();

  const [left, setLeft] = useState(false);
  const [position, setPosition] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const pos = useLiveQuery(() => db.users.toArray());

  useEffect(() => {
    if (!pos || !pos[0] || !pos[0].position) return;
    setPosition(pos[0].position);
    setIsAdmin(pos[0].isAdmin);
  }, [pos]);

  const handleLogout = async () => {
    const auth = getAuth();
    await auth.signOut();
    await db.users
      .where("position")
      .anyOf(["Supervisor", "Technician", "Client"])
      .delete();
    navigate("/");
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setLeft(open);
  };

  const list = () => (
    <Box
      className="menu-drawer"
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <div className="close-button">
        <CloseIcon fontSize="large" onClick={toggleDrawer(false)} />
      </div>
      <div className="image">
        <img src={logo} alt="" />
      </div>
      <List>
        <ListItem button onClick={() => navigate("/home")}>
          <ListItemText className="menu-item" primary="Home" />
        </ListItem>

        <ListItem button onClick={() => navigate("/my-account")}>
          <ListItemText className="menu-item" primary="My Account" />
        </ListItem>

        {position !== "Technician" && (
          <ListItem button onClick={() => navigate("/agreement")}>
            <ListItemText className="menu-item" primary="New Request" />
          </ListItem>
        )}

        {position !== "Technician" && (
          <ListItem button onClick={() => navigate("/track-requests")}>
            <ListItemText className="menu-item" primary="Track Your Requests" />
          </ListItem>
        )}

        {position === "Supervisor" && (
          <ListItem button onClick={() => navigate("/pending-requests")}>
            <ListItemText className="menu-item" primary="Pending Requests" />
          </ListItem>
        )}

        {position === "Technician" && (
          <ListItem button onClick={() => navigate("/list-of-requests")}>
            <ListItemText className="menu-item" primary="List of Requests" />
          </ListItem>
        )}

        {position === "Technician" && (
          <ListItem button onClick={() => navigate("/my-work")}>
            <ListItemText className="menu-item" primary="My Work" />
          </ListItem>
        )}

        {position === "Technician" && !!isAdmin ? (
          <ListItem button onClick={() => navigate("/overview")}>
            <ListItemText className="menu-item" primary="Technicians" />
          </ListItem>
        ) : undefined}

        <ListItem button onClick={() => navigate("/archive")}>
          <ListItemText className="menu-item" primary="Archive" />
        </ListItem>
      </List>

      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemText className="menu-item" primary="Log Out" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment key="left">
        <MenuIcon
          className="hamburger"
          fontSize="large"
          onClick={toggleDrawer(true)}
        >
          {"left"}
        </MenuIcon>
        <Drawer anchor="left" open={left} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
