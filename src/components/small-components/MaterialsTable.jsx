import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
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
import { doc, updateDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

async function addNewMaterial() {}

async function removeMaterial() {}

export default function MaterialsTable() {
  const [addOpen, setAddOpen] = useState(false);
  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => setAddOpen(false);

  const [removeOpen, setRemoveOpen] = useState(false);
  const handleRemoveOpen = () => setRemoveOpen(true);
  const handleRemoveClose = () => setRemoveOpen(false);

  const [material, setMaterial] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [price, setPrice] = useState(null);

  const { state } = useLocation();
  const { time, id, firstname, lastname, email, ...details } = state.data;
  return (
    <div>
      <h3>Ordered Materials</h3>
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
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(details ?? {})
              ?.filter(
                (key) =>
                  key !== "estimatedTime" &&
                  key !== "status" &&
                  key !== "technicianInCharge" &&
                  key !== "account" &&
                  key !== "grant" &&
                  key !== "approvalRequired" &&
                  key !== "supervisor"
              )
              .map((key) => (
                <TableRow key={key}>
                  <TableCell component="th" scope="row">
                    {(key.charAt(0).toUpperCase() + key.slice(1))
                      .match(/([A-Z]?[^A-Z]*)/g)
                      .slice(0, -1)
                      .join(" ")}
                  </TableCell>
                  <TableCell>{details[key]}</TableCell>
                  <TableCell>{details[key]}</TableCell>
                  <TableCell>
                    <IconButton>
                      <DeleteOutlineIcon
                        className="bin"
                        onClick={() => {
                          handleRemoveOpen();
                        }}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add new material
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Eter material:
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
            Enter price (per unit):
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
                addNewMaterial(material, quantity, price);
                handleAddClose();
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
                removeMaterial();
                handleRemoveClose();
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
