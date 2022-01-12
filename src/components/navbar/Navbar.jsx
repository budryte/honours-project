import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import logo from "../../images/logo.png";
import "./navbar.scss";

export default function Navbar() {
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
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className="image">
        <img src={logo} alt="" />
      </div>
      <List className="menu-list">
        <ListItem button>
          <ListItemText primary="My Account" />
        </ListItem>

        <ListItem button>
          <ListItemText primary="New Request" />
        </ListItem>

        <ListItem button>
          <ListItemText primary="Track Request" />
        </ListItem>

        <ListItem button>
          <ListItemText primary="Pending Requests" />
        </ListItem>

        <ListItem button>
          <ListItemText primary="List of Requests" />
        </ListItem>

        <ListItem button>
          <ListItemText primary="My Work" />
        </ListItem>

        <ListItem button>
          <ListItemText primary="My Archive" />
        </ListItem>
      </List>

      <Divider />
      <List className="menu-list">
        <ListItem button>
          <ListItemText primary="Log Out" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
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
