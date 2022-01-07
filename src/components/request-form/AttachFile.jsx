import React, { useState } from "react";
import Button from "@mui/material/Button";
import { useDropzone } from "react-dropzone";
import { TextArea } from "semantic-ui-react";

import "./request-form-style.scss";

function Basic(props) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <section>
      <div className="attach-file">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

export function AttachFile(props) {
  const { handleChange, extraInfo, setExtraInfo } = props;

  return (
    <div className="request-form-tab">
      <h2>Attach Files</h2>
      <Basic />
      <div>
        <h3>Additional Information</h3>
        <TextArea
          className="extra-info"
          placeholder="Please include any additional information"
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        />
      </div>
      <div className="buttons">
        <div className="request-form-button">
          <Button
            variant="contained"
            onClick={() => {
              handleChange(null, 0);
            }}
          >
            Back
          </Button>
        </div>
        <Button
          variant="contained"
          onClick={() => {
            handleChange(null, 2);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
