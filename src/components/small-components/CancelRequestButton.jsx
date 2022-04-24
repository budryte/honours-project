import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CancelRequestButton() {
  let navigate = useNavigate();
  return (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <Button
        variant="outlined"
        color="error"
        onClick={() => {
          navigate("/");
        }}
      >
        Cancel Request
      </Button>
    </div>
  );
}
