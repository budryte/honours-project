import React from "react";
import Button from "@mui/material/Button";
import { getAuth } from "firebase/auth";

export default function Home() {
  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut();
  };

  return (
    <div className="container">
      <div className="title">Welcome to Technical Request System</div>
      <Button variant="contained" onClick={() => handleLogout()}>
        Sign Out
      </Button>
    </div>
  );
}
