import React from "react";
import Button from "@mui/material/Button";
import { useDropzone } from "react-dropzone";
import { Form, TextArea } from "semantic-ui-react";

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

export function AttachFile() {
  return (
    <div className="request-form-tab">
      <h2>Attach Files</h2>
      <Basic />
      <div>
        <h3>Additional Information</h3>
        <TextArea
          className="extra-info"
          placeholder="Please include any additional information"
        />
      </div>
      <div className="buttons">
        <div className="request-form-button">
          <Button variant="contained">Back</Button>
        </div>
        <Button variant="contained">Next</Button>
      </div>
    </div>
  );
}
