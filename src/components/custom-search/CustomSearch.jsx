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
          data: document.data(),
        });
      });
      if (arr.length > 0) {
        console.log("Successfully found");
        navigate("/review-request", {
          state: {
            data: arr[0].data,
            prevPage: "/custom-search",
          },
        });
      } else {
        try {
          const qSnapshot = await getDocs(
            query(
              collectionGroup(getFirestore(), "archive"),
              where("id", "==", requestID)
            )
          );
          let array = [];
          qSnapshot.forEach((document) => {
            array.push({
              data: document.data(),
            });
          });
          if (array.length > 0) {
            console.log("Successfully found");
            navigate("/review-request", {
              state: {
                data: array[0].data,
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
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Navbar />
      <main className="box">
        <h1 className="page-title">Custom Search</h1>
        <div className="white-container">
          <h2 style={{ marginBottom: 0, fontSize: "32px" }}>
            Search for a specific request
          </h2>
          <p style={{ fontStyle: "italic" }}>For example: RTA0000000000001</p>
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
      </main>
    </div>
  );
}
