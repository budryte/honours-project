import React from "react";
import Button from "@mui/material/Button";

export default function Home(props) {
  const { handleLogout } = props;

  return (
    <div className="container">
      <div className="title">Welcome to Technical Request System</div>
      <Button variant="contained" onClick={() => handleLogout()}>
        Sign Out
      </Button>
    </div>
  );
}
