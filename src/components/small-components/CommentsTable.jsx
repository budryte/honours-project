import React, { useState } from "react";
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

export default function CommentsTable({ position, email }) {
  const { state } = useLocation();
  const { id: requestID, userId: parentId, status } = state.data;

  const [commentsArray, setCommentsArray] = useState(state.data.comments ?? []);

  const [comment, setComment] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [commentDate, setCommentDate] = useState(null);
  const [commenter, setCommenter] = useState(null);

  const [tempComment, setTempComment] = useState(null);
  const [tempCommentDate, setTempCommentDate] = useState(null);
  const [tempCommenter, setTempCommenter] = useState(null);

  function addComment() {
    const fireStore = getFirestore();
    const requestRef = doc(fireStore, "users", parentId, "requests", requestID);
    return updateDoc(requestRef, {
      comments: arrayUnion({
        comment: comment,
        commentDate: new Date().getTime(),
        commenter: email,
      }),
    });
  }

  function removeComment(com, comDate, name) {
    const fireStore = getFirestore();
    const requestRef = doc(fireStore, "users", parentId, "requests", requestID);
    return updateDoc(requestRef, {
      comments: arrayRemove({
        comment: com,
        commentDate: comDate,
        commenter: name,
      }),
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
  const handleRemoveClose = () => {
    setRemoveOpen(false);
    setComment(null);
    setCommentError(null);
  };

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
      setCommentError("Comment cannot be empty.");
      toAdd = false;
    }
    return toAdd;
  }

  return (
    <div>
      {status !== "Waiting on technician" && <h2>Comments History</h2>}
      {commentsArray?.length > 0 || status !== "Completed" ? (
        <TableContainer>
          <Table sx={{ minWidth: 450 }} aria-label="simple table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell>
                  <b>Comment</b>
                </TableCell>
                <TableCell>
                  <b>Last modified by</b>
                </TableCell>
                <TableCell>
                  <b>Date</b>
                </TableCell>
                {position === "Technician" && status !== "Completed" ? (
                  <TableCell />
                ) : undefined}
              </TableRow>
            </TableHead>
            <TableBody>
              {commentsArray?.map((commentObj) => (
                <TableRow key={commentObj.comment}>
                  <TableCell component="th" scope="row">
                    {commentObj.comment}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {commentObj.commenter}
                  </TableCell>
                  <TableCell>
                    {new Date(commentObj.commentDate).toLocaleDateString()}
                  </TableCell>
                  {position === "Technician" && status !== "Completed" ? (
                    <TableCell>
                      <IconButton>
                        <EditIcon
                          onClick={() => {
                            setComment(commentObj.comment);
                            setCommentDate(commentObj.commentDate);
                            setCommenter(commentObj.commenter);
                            setTempComment(commentObj.comment);
                            setTempCommentDate(commentObj.commentDate);
                            setTempCommenter(commentObj.commenter);
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
                            setCommenter(commentObj.commenter);
                            handleRemoveOpen();
                          }}
                        />
                      </IconButton>
                    </TableCell>
                  ) : undefined}
                </TableRow>
              ))}
              {position === "Technician" && status !== "Completed" ? (
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
      ) : (
        status !== "Waiting on technician" && (
          <p className="tech-item"> There no comments.</p>
        )
      )}
      <br></br>

      {/* Add new comment */}
      <Modal
        open={addOpen}
        onClose={handleAddClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-style-bigger">
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
            error={commentError !== null}
            onChange={(e) => {
              setCommentError(null);
              setComment(e.target.value);
            }}
          />
          {commentError && <p style={{ color: "#ff0000" }}>{commentError}</p>}

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
                        {
                          comment: comment,
                          commentDate: new Date(),
                          commenter: email,
                        },
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

      {/* Remove comment */}
      <Modal
        open={removeOpen}
        onClose={handleRemoveClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-style">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Remove Comment
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Would you like to remove this comment from the list?
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
                removeComment(comment, commentDate, commenter)
                  .then(() => {
                    setCommentsArray((p) => {
                      let pp = [...p];
                      for (let i = 0; i < pp.length; i++) {
                        if (
                          pp[i].comment === comment &&
                          pp[i].commentDate === commentDate &&
                          pp[i].commenter === commenter
                        ) {
                          pp.splice(i, 1);
                          break;
                        }
                      }
                      return pp;
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    // Could not remove material from Firestore
                  })
                  .finally(() => {
                    handleRemoveClose();
                  });
              }}
            >
              OK
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Edit comment */}
      <Modal
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-style-bigger">
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ mt: 2, mb: 3 }}
          >
            Edit Comment
          </Typography>
          <TextArea
            className="link"
            placeholder="Enter your comment here"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {commentError && <p style={{ color: "#ff0000" }}>{commentError}</p>}
          <div className="modal-buttons">
            <div className="request-form-button">
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  handleEditClose();
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
                  removeComment(tempComment, tempCommentDate, tempCommenter)
                    .then(() => addComment())
                    .then(() => {
                      setCommentsArray((p) => {
                        let pp = [...p];
                        for (let i = 0; i < pp.length; i++) {
                          if (
                            pp[i].comment === tempComment &&
                            pp[i].commentDate === tempCommentDate &&
                            pp[i].commenter === tempCommenter
                          ) {
                            pp.splice(i, 1, {
                              comment,
                              commentDate,
                              commenter,
                            });
                            break;
                          }
                        }
                        return pp;
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      // Could not update material to Firestore
                    })
                    .finally(() => {
                      handleEditClose();
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
