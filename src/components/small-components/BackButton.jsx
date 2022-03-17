import React from "react";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function BackButton(props) {
  const { pageTitle } = props;
  let navigate = useNavigate();
  return (
    <IconButton>
      <ArrowBackIcon
        aria-label="back button"
        fontSize="large"
        className="arrow"
        onClick={() => {
          navigate(pageTitle);
        }}
      />
    </IconButton>
  );
}
