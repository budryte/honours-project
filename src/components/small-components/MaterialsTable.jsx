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

export default function MaterialsTable(props) {
  const position = props.position;

  const [addOpen, setAddOpen] = useState(false);
  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => {
    setAddOpen(false);
    setMaterialError(null);
    setQtyError(null);
    setPriceError(null);
    setMaterial(null);
    setQuantity(null);
    setPrice(null);
  };

  const [removeOpen, setRemoveOpen] = useState(false);
  const handleRemoveOpen = () => setRemoveOpen(true);
  const handleRemoveClose = () => {
    setRemoveOpen(false);
    setMaterialError(null);
    setQtyError(null);
    setPriceError(null);
    setMaterial(null);
    setQuantity(null);
    setPrice(null);
  };

  const [editOpen, setEditOpen] = useState(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => {
    setEditOpen(false);
    setMaterialError(null);
    setQtyError(null);
    setPriceError(null);
    setMaterial(null);
    setQuantity(null);
    setPrice(null);
  };

  const [material, setMaterial] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [price, setPrice] = useState(null);

  const [materialError, setMaterialError] = useState(null);
  const [qtyError, setQtyError] = useState(null);
  const [priceError, setPriceError] = useState(null);

  const [tempMat, setTempMat] = useState(null);
  const [tempQty, setTempQty] = useState(null);
  const [tempPrice, setTempPrice] = useState(null);

  const { state } = useLocation();
  const { id: requestID } = state.data;
  const status = useState(state.data.status);

  const [matArr, setMatArr] = useState(state.data.materials);
  const [total, setTotal] = useState(
    matArr?.reduce((acc, mat) => acc + parseFloat(mat.price), 0) ?? 0
  );

  useEffect(() => calculateTotal(), [matArr]);

  function calculateTotal() {
    setTotal(matArr?.reduce((acc, mat) => acc + parseFloat(mat.price), 0) ?? 0);
  }

  function checkMaterial() {
    let toAdd = true;

    if (!material) {
      setMaterialError("Please enter material");
      toAdd = false;
    }
    if (!quantity) {
      setQtyError("Please enter quantity");
      toAdd = false;
    }
    if (!price) {
      setPriceError("Please enter price");
      toAdd = false;
    } else if (!/^(\d*[.])?\d+$/.test(price)) {
      setPriceError("Please enter numerical values only");
      toAdd = false;
    }

    return toAdd;
  }

  function addNewMaterial() {
    const fireStore = getFirestore();
    const requestRef = doc(
      fireStore,
      "users",
      props.parentId,
      "requests",
      requestID
    );
    return updateDoc(requestRef, {
      materials: arrayUnion({ material, quantity, price }),
    });
  }

  function removeMaterial(mat, qty, cost) {
    const fireStore = getFirestore();
    const requestRef = doc(
      fireStore,
      "users",
      props.parentId,
      "requests",
      requestID
    );
    return updateDoc(requestRef, {
      materials: arrayRemove({ material: mat, quantity: qty, price: cost }),
    });
  }

  return (
    <div>
      {status !== "Waiting on technician" && <h2>Ordered Materials</h2>}
      {matArr?.length > 0 || position === "Technician" ? (
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
                {position === "Technician" && <TableCell />}
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
                  <TableCell>£{mat.price}</TableCell>
                  {position === "Technician" && status !== "Completed" ? (
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
              <TableRow>
                <TableCell rowSpan={3} />
                <TableCell align="right" colSpan={1}>
                  <b>Total:</b>
                </TableCell>
                <TableCell align="left">£{total.toFixed(2)}</TableCell>
                {position === "Technician" && status !== "Completed" && (
                  <TableCell />
                )}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        status !== "Waiting on technician" && (
          <p className="tech-item">There no materials ordered.</p>
        )
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
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ mt: 2, mb: 3 }}
          >
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
            error={materialError !== null}
            onChange={(e) => {
              setMaterialError(null);
              setMaterial(e.target.value);
            }}
            helperText={materialError}
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Enter Quanity:
          </Typography>
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Quantity"
            variant="outlined"
            required
            size="small"
            value={quantity}
            error={qtyError !== null}
            onChange={(e) => {
              setQtyError(null);
              setQuantity(e.target.value);
            }}
            helperText={qtyError}
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Enter Price (£):
          </Typography>
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Price"
            variant="outlined"
            required
            size="small"
            value={price}
            error={priceError !== null}
            onChange={(e) => {
              setPriceError(null);
              setPrice(e.target.value);
            }}
            helperText={priceError}
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
                if (checkMaterial()) {
                  addNewMaterial()
                    .then(() => {
                      setMatArr((p) => [...p, { material, quantity, price }]);
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

      {/* Remove material */}
      <Modal
        open={removeOpen}
        onClose={handleRemoveClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-style">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Remove Item
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Would you like to remove this item from the list?
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
                removeMaterial(material, quantity, price)
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
                  .then(() => calculateTotal())
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
            error={materialError !== null}
            onChange={(e) => {
              setMaterialError(null);
              setMaterial(e.target.value);
            }}
            helperText={materialError}
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
            error={qtyError !== null}
            onChange={(e) => {
              setQtyError(null);
              setQuantity(e.target.value);
            }}
            helperText={qtyError}
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Price (£):
          </Typography>
          <TextField
            className="form-group"
            id="outlined-basic"
            label="Price"
            variant="outlined"
            required
            size="small"
            value={price}
            error={priceError !== null}
            onChange={(e) => {
              setPriceError(null);
              setPrice(e.target.value);
            }}
            helperText={priceError}
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
                if (checkMaterial()) {
                  removeMaterial(tempMat, tempQty, tempPrice)
                    .then(() => addNewMaterial())
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
