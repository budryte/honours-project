import React, { useState, useEffect } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
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
  TextField,
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

function addNewMaterial(requestID, parentId, material, quantity, price) {
  const fireStore = getFirestore();
  const requestRef = doc(fireStore, "users", parentId, "requests", requestID);
  return updateDoc(requestRef, {
    materials: arrayUnion({ material, quantity, price }),
  });
}

function removeMaterial(requestID, parentId, material, quantity, price) {
  const fireStore = getFirestore();
  const requestRef = doc(fireStore, "users", parentId, "requests", requestID);
  return updateDoc(requestRef, {
    materials: arrayRemove({ material, quantity, price }),
  });
}

export default function MaterialsTable(props) {
  const [pos, setPos] = useState(null);
  const users = useLiveQuery(() => dexieDB.users.toArray());
  useEffect(() => {
    if (!users || !users[0] || !users[0].email) return;
    setPos(users[0].position);
  }, [users]);

  const [addOpen, setAddOpen] = useState(false);
  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => setAddOpen(false);

  const [removeOpen, setRemoveOpen] = useState(false);
  const handleRemoveOpen = () => setRemoveOpen(true);
  const handleRemoveClose = () => setRemoveOpen(false);

  const [editOpen, setEditOpen] = useState(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const [material, setMaterial] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [price, setPrice] = useState(null);

  const [tempMat, setTempMat] = useState(null);
  const [tempQty, setTempQty] = useState(null);
  const [tempPrice, setTempPrice] = useState(null);

  const { state } = useLocation();
  const { id: requestID } = state.data;

  const [matArr, setMatArr] = useState(state.data.materials);

  return (
    <div>
      <h3>Ordered Materials</h3>
      {matArr !== undefined ? (
        <TableContainer>
          <Table sx={{ minWidth: 450 }} aria-label="simple table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell>
                  <b>Material</b>
                </TableCell>
                <TableCell>
                  <b>Qty</b>
                </TableCell>
                <TableCell>
                  <b>Price</b>
                </TableCell>
                {pos === "Technician" && <TableCell />}
              </TableRow>
            </TableHead>
            <TableBody>
              {matArr?.map((mat) => (
                <TableRow key={mat.material}>
                  <TableCell component="th" scope="row">
                    {(
                      mat.material.charAt(0).toUpperCase() +
                      mat.material.slice(1)
                    )
                      .match(/([A-Z]?[^A-Z]*)/g)
                      .slice(0, -1)
                      .join(" ")}
                  </TableCell>
                  <TableCell>{mat.quantity}</TableCell>
                  <TableCell>{mat.price}</TableCell>
                  {pos === "Technician" ? (
                    <TableCell>
                      <IconButton>
                        <EditIcon
                          onClick={() => {
                            setMaterial(mat.material);
                            setQuantity(mat.quantity);
                            setPrice(mat.price);
                            setTempMat(mat.material);
                            setTempQty(mat.quantity);
                            setTempPrice(mat.price);
                            handleEditOpen();
                          }}
                        />
                      </IconButton>
                      <IconButton>
                        <DeleteOutlineIcon
                          className="bin"
                          onClick={() => {
                            setMaterial(mat.material);
                            setQuantity(mat.quantity);
                            setPrice(mat.price);
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
                  <TableCell paddingNone>
                    <div className="add-row">
                      <IconButton>
                        <AddIcon
                          fontSize="large"
                          onClick={() => {
                            handleAddOpen();
                          }}
                        />
                      </IconButton>
                    </div>
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
              ) : undefined}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>There no materials ordered yet.</p>
      )}
      <br></br>

      {/* Add new material */}
      <Modal
        open={addOpen}
        onClose={handleAddClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-style">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add New Material
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Enter Material:
          </Typography>
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Material"
            variant="outlined"
            required
            size="small"
            value={material}
            onChange={(e) => {
              setMaterial(e.target.value);
            }}
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Enter Quantity:
          </Typography>
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Quantity"
            variant="outlined"
            required
            size="small"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Enter Price:
          </Typography>
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Price"
            variant="outlined"
            required
            size="small"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
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
                addNewMaterial(
                  requestID,
                  props.parentId,
                  material,
                  quantity,
                  price
                )
                  .then(() => {
                    setMatArr((p) => [...p, { material, quantity, price }]);
                  })
                  .catch((err) => {
                    console.log(err);
                    // Could not save material to Firestore
                  })
                  .finally(() => {
                    setMaterial(null);
                    setQuantity(null);
                    setPrice(null);
                    handleAddClose();
                  });
              }}
            >
              Save
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Remove material */}
      <Modal
        open={removeOpen}
        onClose={handleRemoveClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-style">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Remove item
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Would you like to remove material from the list?
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
                removeMaterial(
                  requestID,
                  props.parentId,
                  material,
                  quantity,
                  price
                )
                  .then(() => {
                    setMatArr((p) => {
                      let pp = [...p];
                      for (let i = 0; i < pp.length; i++) {
                        if (
                          pp[i].material === material &&
                          pp[i].quantity === quantity &&
                          pp[i].price === price
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
                    setMaterial(null);
                    setQuantity(null);
                    setPrice(null);
                    handleRemoveClose();
                  });
              }}
            >
              OK
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Edit material */}
      <Modal
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-style">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Material
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Material:
          </Typography>
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Material"
            variant="outlined"
            required
            size="small"
            value={material}
            onChange={(e) => {
              setMaterial(e.target.value);
            }}
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Quantity:
          </Typography>
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Quantity"
            variant="outlined"
            required
            size="small"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Price:
          </Typography>
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Price"
            variant="outlined"
            required
            size="small"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
          />
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
                removeMaterial(
                  requestID,
                  props.parentId,
                  tempMat,
                  tempQty,
                  tempPrice
                )
                  .then(() =>
                    addNewMaterial(
                      requestID,
                      props.parentId,
                      material,
                      quantity,
                      price
                    )
                  )
                  .then(() => {
                    setMatArr((p) => {
                      let pp = [...p];
                      for (let i = 0; i < pp.length; i++) {
                        if (
                          pp[i].material === tempMat &&
                          pp[i].quantity === tempQty &&
                          pp[i].price === tempPrice
                        ) {
                          pp.splice(i, 1, {
                            material,
                            quantity,
                            price,
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
                    setMaterial(null);
                    setQuantity(null);
                    setPrice(null);
                    handleEditClose();
                  });
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
