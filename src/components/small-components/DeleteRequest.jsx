import React, { useState } from "react";
import { Button, Modal, Box, Typography } from "@mui/material";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function DeleteRequest(props) {
  let collection = props.status === "Completed" ? "archive" : "requests";

  let navigate = useNavigate();

  const [removeOpen, setRemoveOpen] = useState(false);
  const handleRemoveOpen = () => setRemoveOpen(true);
  const handleRemoveClose = () => setRemoveOpen(false);

  function deleteRequest() {
    const db = getFirestore();
    try {
      return deleteDoc(
        doc(db, "users", props.userID, collection, props.requestID)
      );
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <Button
        color="error"
        variant="contained"
        style={{ marginTop: "20px" }}
        onClick={() => {
          handleRemoveOpen();
        }}
      >
        Delete Request
      </Button>

      {/* Delete request */}
      <Modal
        open={removeOpen}
        onClose={handleRemoveClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-style">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Remove Request
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Would you like to remove request {props.requestID}
            {""} from the list?
          </Typography>
          <div className="modal-buttons">
            <div className="request-form-button">
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  handleRemoveClose();
                }}
              >
                Cancel
              </Button>
            </div>
            <Button
              variant="outlined"
              color="success"
              onClick={() => {
                deleteRequest();
                navigate("/home");
                alert("Request was successfully removed from the list.");
              }}
            >
              OK
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
