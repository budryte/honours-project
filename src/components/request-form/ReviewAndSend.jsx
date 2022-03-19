import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { getAuth } from "firebase/auth";
import { doc, setDoc, getFirestore, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { db as dexieDB } from "../../config/db";

async function saveToFirestore(details, extraInfo, linkToFolder, user) {
  let statusOnSubmission =
    details.approvalRequired === "No"
      ? "Waiting on technician"
      : "Pending approval";

  console.log(statusOnSubmission);

  const db = getFirestore();
  const auth = getAuth();
  const id = `RTA${Date.now().toString()}`;
  await setDoc(doc(db, "users", auth.currentUser.uid, "requests", id), {
    ...details,
    extraInfo,
    linkToFolder,
    time: serverTimestamp(),
    id: id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    status: statusOnSubmission,
    userId: auth.currentUser.uid,
  });
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export function ReviewAndSend(props) {
  const { handleChange, details, extraInfo, linkToFolder } = props;

  const [open, setOpen] = useState(false);
  const users = useLiveQuery(() => dexieDB.users.toArray());
  const handleOpen = () => setOpen(true);
  let navigate = useNavigate();

  return (
    <div className="request-form-tab">
      <h2>Review Request Details</h2>
      <TableContainer>
        <Table sx={{ minWidth: 450 }} aria-label="simple table">
          <TableBody>
            {Object.keys(details ?? {})?.map((key) => (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  {(key.charAt(0).toUpperCase() + key.slice(1))
                    .match(/([A-Z]?[^A-Z]*)/g)
                    .slice(0, -1)
                    .join(" ")}
                </TableCell>
                <TableCell>{details[key]}</TableCell>
              </TableRow>
            ))}
            {linkToFolder !== "" && (
              <TableRow key={linkToFolder}>
                <TableCell component="th" scope="row">
                  Link
                </TableCell>
                <TableCell>{linkToFolder}</TableCell>
              </TableRow>
            )}
            {extraInfo !== "" && (
              <TableRow key={extraInfo}>
                <TableCell component="th" scope="row">
                  Additional Information
                </TableCell>
                <TableCell>{extraInfo}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="buttons">
        <div className="request-form-button">
          <Button
            variant="contained"
            onClick={() => {
              handleChange(null, 1);
            }}
          >
            Back
          </Button>
        </div>
        <Button
          variant="contained"
          onClick={() => {
            saveToFirestore(details, extraInfo, linkToFolder, users[0]);
            handleOpen();
          }}
        >
          Send
        </Button>
        <Modal
          open={open}
          onClose={() => {
            navigate("/home");
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Confirmation
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Your request has been sent successfully. <br></br>You can now
              track your request.
            </Typography>
            <div className="modal-buttons">
              <div className="request-form-button">
                <Button
                  variant="outlined"
                  onClick={() => {
                    navigate("/track-requests");
                  }}
                >
                  Track Request
                </Button>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            navigate("/home");
          }}
        >
          Cancel Request
        </Button>
      </div>
    </div>
  );
}
