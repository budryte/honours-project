import React, { useState } from "react";
import Navbar from "../navbar/Navbar";
import { TextField, Button } from "@mui/material";
import {
  getFirestore,
  query,
  collectionGroup,
  getDocs,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function CustomSearch() {
  let navigate = useNavigate();
  const [requestID, setRequestID] = useState(null);
  const [requestIDError, setRequestIDError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  function checkID() {
    if (!requestID) {
      setRequestIDError("Please enter request ID that starts with 'RTA'");
      return false;
    }
    return true;
  }

  async function searchForRequest() {
    try {
      const querySnapshot = await getDocs(
        query(
          collectionGroup(getFirestore(), "requests"),
          where("id", "==", requestID)
        )
      );
      let arr = [];
      querySnapshot.forEach((document) => {
        arr.push({
          id: document.id,
          data: document.data(),
          parentId: document.ref.parent.parent.id,
        });
      });
      if (arr.length > 0) {
        console.log("Successfully found");
        navigate("/review-request", {
          state: {
            parentId: arr[0].parentId,
            data: arr[0].data,
            prevPage: "/custom-search",
          },
        });
      } else {
        console.log("not found");
        setErrorMessage("Request was not found. Try again.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="box">
        <div className="page-title">Custom Search</div>
        <div className="white-container">
          <h1>Search for a specific request</h1>
          <TextField
            style={{ marginRight: "15px" }}
            className="form-group"
            id="outlined-basic"
            label="Request ID"
            variant="outlined"
            required
            size="small"
            value={requestID}
            error={requestIDError !== null}
            onChange={(e) => {
              setRequestIDError(null);
              setErrorMessage(null);
              setRequestID(e.target.value);
            }}
            helperText={requestIDError}
          />
          <Button
            variant="contained"
            onClick={() => {
              if (checkID()) {
                try {
                  searchForRequest();
                } catch (error) {
                  console.log(error);
                }
              }
            }}
          >
            Search
          </Button>
          {errorMessage && <p>{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}
