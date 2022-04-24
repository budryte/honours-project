import React, { useState, useEffect } from "react";
import { Box, Drawer, List, Divider, ListItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import PersonIcon from "@mui/icons-material/Person";
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
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const user = useLiveQuery(() => db.table("users").toCollection().first());

  useEffect(() => {
    if (!user) return;

    setPosition(user.position);
    setIsAdmin(user.isAdmin);
    setFirstname(user.firstname);
    setLastname(user.lastname);
  }, [user]);

  const handleLogout = async () => {
    await Promise.all([
      getAuth().signOut(),
      db.table("users").toCollection().delete(),
    ]);
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
            navigate("/");
          }}
        />
      </div>
      <Divider />
      <p
        className="account-intro"
        style={{ marginBottom: position !== "Client" ? "5px" : undefined }}
      >
        <PersonIcon
          className="menu-icon"
          onClick={() => {
            navigate("/my-account");
          }}
        />{" "}
        {firstname} {lastname}
      </p>
      {position !== "Client" && <div className="position">{position}</div>}
      <Divider />
      <List style={{ paddingTop: "15px" }}>
        <ListItem
          button
          className="menu-item"
          style={{ paddingLeft: "40px" }}
          onClick={() => navigate("/")}
        >
          <HomeOutlinedIcon className="menu-icon" />
          Home
        </ListItem>
        <ListItem
          button
          className="menu-item"
          style={{ paddingLeft: "40px" }}
          onClick={() => navigate("/my-account")}
        >
          <AccountCircleOutlinedIcon className="menu-icon" />
          My Account
        </ListItem>
        {position !== "Technician" && (
          <ListItem
            button
            className="menu-item"
            style={{ paddingLeft: "40px" }}
            onClick={() => navigate("/agreement")}
          >
            <PostAddOutlinedIcon className="menu-icon" />
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
            <ManageSearchOutlinedIcon className="menu-icon" />
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
            <FactCheckOutlinedIcon className="menu-icon" />
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
            <ViewListOutlinedIcon className="menu-icon" />
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
            <AccessTimeOutlinedIcon className="menu-icon" />
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
            <SupervisorAccountOutlinedIcon className="menu-icon" />
            Technicians
          </ListItem>
        ) : undefined}
        <ListItem
          button
          className="menu-item"
          style={{ paddingLeft: "40px" }}
          onClick={() => navigate("/archive")}
        >
          <ArchiveOutlinedIcon className="menu-icon" />
          Archive
        </ListItem>
        {position === "Technician" || position === "Supervisor" ? (
          <ListItem
            button
            className="menu-item"
            style={{ paddingLeft: "40px" }}
            onClick={() => navigate("/custom-search")}
          >
            <SearchOutlinedIcon className="menu-icon" />
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
          <HelpOutlineOutlinedIcon className="menu-icon" />
          Help
        </ListItem>
        <ListItem
          button
          className="menu-item"
          style={{ paddingLeft: "40px" }}
          onClick={handleLogout}
        >
          <LogoutOutlinedIcon className="menu-icon" />
          Log Out
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
            onClick={() => navigate("/")}
          ></HomeIcon>
          <Drawer anchor="left" open={left} onClose={toggleDrawer(false)}>
            <Menu />
          </Drawer>
        </React.Fragment>
      </nav>
    </header>
  );
}
