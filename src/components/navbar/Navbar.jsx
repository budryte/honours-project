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
import HomeIcon from "@mui/icons-material/Home";
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

  const Menu = () => (
    <Box
      className="menu-drawer"
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <div className="close-button">
        <CloseIcon fontSize="large" onClick={toggleDrawer(false)} />
      </div>
      <div className="image-navbar">
        <img
          src={logo}
          alt="logo"
          onClick={() => {
            navigate("/home");
          }}
        />
      </div>
      <List style={{ paddingTop: "15px" }}>
        <ListItem
          button
          className="menu-item"
          style={{ paddingLeft: "40px" }}
          onClick={() => navigate("/home")}
        >
          Home
        </ListItem>

        <ListItem
          button
          className="menu-item"
          style={{ paddingLeft: "40px" }}
          onClick={() => navigate("/my-account")}
        >
          My Account
        </ListItem>

        {position !== "Technician" && (
          <ListItem
            button
            className="menu-item"
            style={{ paddingLeft: "40px" }}
            onClick={() => navigate("/agreement")}
          >
            New Request
          </ListItem>
        )}

        {position !== "Technician" && (
          <ListItem
            button
            className="menu-item"
            style={{ paddingLeft: "40px" }}
            onClick={() => navigate("/track-requests")}
          >
            Track Your Requests
          </ListItem>
        )}

        {position === "Supervisor" && (
          <ListItem
            button
            className="menu-item"
            style={{ paddingLeft: "40px" }}
            onClick={() => navigate("/pending-requests")}
          >
            Pending Requests
          </ListItem>
        )}

        {position === "Technician" && (
          <ListItem
            button
            className="menu-item"
            style={{ paddingLeft: "40px" }}
            onClick={() => navigate("/list-of-requests")}
          >
            List of Requests
          </ListItem>
        )}

        {position === "Technician" && (
          <ListItem
            button
            className="menu-item"
            style={{ paddingLeft: "40px" }}
            onClick={() => navigate("/my-work")}
          >
            My Work
          </ListItem>
        )}

        {position === "Technician" && !!isAdmin ? (
          <ListItem
            button
            className="menu-item"
            style={{ paddingLeft: "40px" }}
            onClick={() => navigate("/overview")}
          >
            Technicians
          </ListItem>
        ) : undefined}

        <ListItem
          button
          className="menu-item"
          style={{ paddingLeft: "40px" }}
          onClick={() => navigate("/archive")}
        >
          Archive
        </ListItem>

        {position === "Technician" || position === "Supervisor" ? (
          <ListItem
            button
            className="menu-item"
            style={{ paddingLeft: "40px" }}
            onClick={() => navigate("/custom-search")}
          >
            Custom Search
          </ListItem>
        ) : undefined}
      </List>

      <Divider />
      <List>
        <ListItem
          button
          className="menu-item"
          style={{ paddingLeft: "40px" }}
          onClick={() => navigate("/about")}
        >
          Help
        </ListItem>
        <ListItem
          button
          className="menu-item"
          style={{ paddingLeft: "40px" }}
          onClick={handleLogout}
        >
          <b>Log Out</b>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <header>
      <nav>
        <React.Fragment key="left">
          <MenuIcon
            className="hamburger"
            fontSize="large"
            onClick={toggleDrawer(true)}
          >
            {"left"}
          </MenuIcon>
          <HomeIcon
            className="hamburger"
            fontSize="large"
            onClick={() => navigate("/home")}
          ></HomeIcon>
          <Drawer anchor="left" open={left} onClose={toggleDrawer(false)}>
            <Menu />
          </Drawer>
        </React.Fragment>
      </nav>
    </header>
  );
}
