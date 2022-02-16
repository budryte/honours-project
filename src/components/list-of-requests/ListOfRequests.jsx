import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { Button, List, ListItem, Grid } from "@mui/material";
import Filters from "../small-components/Filters";
import {
  collectionGroup,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { useLiveQuery } from "dexie-react-hooks";
import { db as dexieDB } from "../../config/db";

import "./list-of-requests.scss";

export default function ListofRequests() {
  let navigate = useNavigate();
  const users = useLiveQuery(() => dexieDB.users.toArray());
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    getIncompleteRequests();
  }, [users]);

  useEffect(() => {
    if (!filters) return;

    if (filters === "cleared") {
      getIncompleteRequests();
      return;
    }

    (async () => {
      try {
        console.log("filters: ", filters);
        const filteredQuery = !filters.status
          ? query(
              collectionGroup(getFirestore(), "requests"),
              where("status", "!=", "Completed"),
              where("priority", "==", filters.priority)
            )
          : !filters.priority
          ? query(
              collectionGroup(getFirestore(), "requests"),
              where("status", "==", filters.status)
            )
          : query(
              collectionGroup(getFirestore(), "requests"),
              where("status", "==", filters.status),
              where("priority", "==", filters.priority)
            );

        console.log("filteredQuery: ", filteredQuery);

        const querySnapshot = await getDocs(filteredQuery);
        let reqArr = [];
        querySnapshot.forEach((doc) => {
          reqArr.push({ parentId: doc.ref.parent.parent.id, data: doc.data() });
        });
        setRequests(reqArr);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [filters]);

  async function getIncompleteRequests() {
    try {
      const querySnapshot = await getDocs(
        query(
          collectionGroup(getFirestore(), "requests"),
          where("status", "!=", "Completed")
        )
      );
      let reqArr = [];
      querySnapshot.forEach((doc) => {
        reqArr.push({ parentId: doc.ref.parent.parent.id, data: doc.data() });
      });
      setRequests(reqArr);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="box-list">
        <div className="page-title">List of Requests</div>
        <div className="list-container">
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Filters setFilters={setFilters} />
            </Grid>
            <Grid item xs={9}>
              {requests.length > 0 ? (
                <List>
                  {requests.map((req) => (
                    <ListItem key={req.data.id}>
                      <Button
                        onClick={() =>
                          navigate("/pick-up-request", {
                            state: { data: req.data, parentId: req.parentId },
                          })
                        }
                        variant="outlined"
                        className="list-of-request-button"
                      >
                        <div className="list-of-request-item">
                          <div>
                            <p>
                              <b className="id">{req.data.id} </b>
                              {"Submitted: "}
                              {new Date(
                                req.data.time.seconds * 1000
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <p>
                            <b>{req.data.status}</b>
                          </p>
                        </div>
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <p>There are no requests in the queue.</p>
              )}
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}
