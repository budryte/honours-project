import React, { useState } from "react";
import { Button } from "@mui/material";
import { TextArea } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import CancelRequestButton from "../../components/small-components/CancelRequestButton";

import "./request-form-style.scss";

export function AttachFile(props) {
  const {
    handleChange,
    extraInfo,
    setExtraInfo,
    linkToFolder,
    setLinkToFolder,
  } = props;

  let navigate = useNavigate();
  const [linkError, setLinkError] = useState(null);

  function validateLink() {
    let pattern =
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
    if (!pattern.test(linkToFolder)) {
      setLinkError("Please enter a valid link to OneDrive folder");
      return false;
    }
    return true;
  }

  return (
    <div className="request-form-tab">
      <h2 style={{ marginBottom: 0 }}>Nature of Request</h2>
      <p style={{ marginBottom: "25px" }}>
        * Required - Please fill in all fields in order to proceed
      </p>
      <h3 style={{ marginBottom: 0 }}>Link to OneDrive Folder *</h3>
      <p style={{ marginTop: 0 }}>Make sure the folder is visible to others</p>
      <TextArea
        className="onedrive-link"
        placeholder="Insert a link to the OneDrive folder where technicians could find relevant drawings, schemes and files in order to build what's requested"
        value={linkToFolder}
        onChange={(e) => {
          setLinkToFolder(e.target.value);
          setLinkError(null);
        }}
      />
      {linkError !== null && (
        <p style={{ color: "red", marginTop: 0 }}>{linkError}</p>
      )}
      <div>
        <h3>Additional Information *</h3>
        <TextArea
          className="extra-info"
          placeholder="Please include any additional information to explain the nature of your request"
          value={extraInfo}
          onChange={(e) => {
            setExtraInfo(e.target.value);
            setLinkError(null);
          }}
        />
      </div>
      <div className="buttons">
        <div className="request-form-button">
          <Button
            size="large"
            variant="contained"
            onClick={() => {
              handleChange(null, 0);
            }}
          >
            Back
          </Button>
        </div>
        <Button
          size="large"
          variant="contained"
          disabled={extraInfo === "" || linkToFolder === ""}
          onClick={() => {
            if (validateLink()) {
              handleChange(null, 2);
            }
          }}
        >
          Next
        </Button>
      </div>
      <CancelRequestButton />
    </div>
  );
}
