import React, { useState, useEffect } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { TextArea } from "semantic-ui-react";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  IconButton,
  Button,
  Modal,
  Box,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import {
  doc,
  updateDoc,
  getFirestore,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useLiveQuery } from "dexie-react-hooks";
import { db as dexieDB } from "../../config/db";

export default function CommentsTable(props) {
  const [pos, setPos] = useState(null);
  const [email, setEmail] = useState(null);
  const users = useLiveQuery(() => dexieDB.users.toArray());

  useEffect(() => {
    if (!users || !users[0] || !users[0].email) return;
    setPos(users[0].position);
    setEmail(users[0].email);
  }, [users]);

  const { state } = useLocation();
  const { id: requestID } = state.data;

  const [commentsArray, setCommentsArray] = useState(state.data.comments ?? []);

  const [comment, setComment] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [commentDate, setCommentDate] = useState(null);

  function addComment() {
    const fireStore = getFirestore();
    const requestRef = doc(
      fireStore,
      "users",
      props.parentId,
      "requests",
      requestID
    );
    return updateDoc(requestRef, {
      comments: arrayUnion({
        comment: comment,
        commentDate: new Date().getTime(),
      }),
    });
  }

  function removeComment() {
    const fireStore = getFirestore();
    const requestRef = doc(
      fireStore,
      "users",
      props.parentId,
      "requests",
      requestID
    );
    return updateDoc(requestRef, {
      comments: arrayRemove({ comment, commentDate }),
    });
  }

  const [addOpen, setAddOpen] = useState(false);
  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => {
    setAddOpen(false);
    setComment(null);
    setCommentError(null);
  };

  const [removeOpen, setRemoveOpen] = useState(false);
  const handleRemoveOpen = () => setRemoveOpen(true);
  const handleRemoveClose = () => setRemoveOpen(false);

  const [editOpen, setEditOpen] = useState(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => {
    setEditOpen(false);
    setComment(null);
    setCommentError(null);
  };

  function checkComment() {
    let toAdd = true;

    if (!comment) {
      setCommentError("Please enter comment");
      toAdd = false;
    }
    return toAdd;
  }

  return (
    <div>
      <h3>Comments History</h3>
      <TableContainer>
        <Table sx={{ minWidth: 450 }} aria-label="simple table">
          <TableHead className="table-head">
            <TableRow>
              <TableCell>
                <b>Comment</b>
              </TableCell>
              <TableCell>
                <b>Date</b>
              </TableCell>
              {pos === "Technician" && <TableCell />}
            </TableRow>
          </TableHead>
          <TableBody>
            {commentsArray?.map((commentObj) => (
              <TableRow key={commentObj.comment}>
                <TableCell component="th" scope="row">
                  {commentObj.comment}
                </TableCell>
                <TableCell>
                  {new Date(commentObj.commentDate).toLocaleDateString()}
                </TableCell>
                {pos === "Technician" ? (
                  <TableCell>
                    <IconButton>
                      <EditIcon
                        onClick={() => {
                          setComment(commentObj.comment);
                          setCommentDate(commentObj.commentDate);
                          handleEditOpen();
                        }}
                      />
                    </IconButton>
                    <IconButton>
                      <DeleteOutlineIcon
                        className="bin"
                        onClick={() => {
                          setComment(commentObj.comment);
                          setCommentDate(commentObj.commentDate);
                          handleRemoveOpen();
                        }}
                      />
                    </IconButton>
                  </TableCell>
                ) : undefined}
              </TableRow>
            ))}
            {pos === "Technician" ? (
              <TableRow>
                <IconButton>
                  <AddIcon
                    fontSize="large"
                    onClick={() => {
                      handleAddOpen();
                    }}
                  />
                </IconButton>
              </TableRow>
            ) : undefined}
          </TableBody>
        </Table>
      </TableContainer>
      <br></br>

      {/* Add new material */}
      <Modal
        open={addOpen}
        onClose={handleAddClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-style">
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ mt: 2, mb: 3 }}
          >
            Add Comment
          </Typography>
          <TextArea
            className="link"
            placeholder="Enter your comment here"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="modal-buttons">
            <div className="request-form-button">
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  handleAddClose();
                }}
              >
                Cancel
              </Button>
            </div>
            <Button
              variant="outlined"
              color="success"
              onClick={() => {
                if (checkComment()) {
                  addComment()
                    .then(() => {
                      setCommentsArray((p) => [
                        ...p,
                        { comment: comment, commentDate: new Date() },
                      ]);
                    })
                    .catch((err) => {
                      console.log(err);
                      // Could not save material to Firestore
                    })
                    .finally(() => {
                      handleAddClose();
                    });
                }
              }}
            >
              Save
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}