import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { Button, List, ListItem, Grid } from "@mui/material";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import WarningIcon from "@mui/icons-material/Warning";

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
  const [sorting, setSorting] = useState(null);

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

      reqArr.sort(function (x, y) {
        return x.data.time - y.data.time;
      });
      setRequests(reqArr);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!sorting) return;
    console.log(sorting.sortingType);

    let reqArr = [...requests];

    if (sorting.sortingType === "newest first") {
      reqArr.sort(function (x, y) {
        return y.data.time - x.data.time;
      });
    } else {
      reqArr.sort(function (x, y) {
        return x.data.time - y.data.time;
      });
    }

    setRequests(reqArr);
  }, [sorting]);

  return (
    <div>
      <Navbar />
      <div className="box-list">
        <div className="page-title">List of Requests</div>
        <div className="list-container">
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Filters setFilters={setFilters} setSorting={setSorting} />
            </Grid>
            <Grid item xs={9}>
              {requests.length > 0 ? (
                <List>
                  {requests.map((req) => (
                    <ListItem key={req.data.id}>
                      <Button
                        onClick={() =>
                          navigate("/pick-up-request", {
                            state: {
                              data: req.data,
                              parentId: req.parentId,
                              prevPage: "/list-of-requests",
                            },
                          })
                        }
                        variant="outlined"
                        className="list-of-request-button"
                      >
                        <div className="list-of-request-item">
                          <div>
                            <p>
                              <b className="id">{req.data.id} </b>
                              {new Date(
                                req.data.time.seconds * 1000
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="para">
                              <b className="id status">{req.data.status}</b>
                              {req.data.priority === "Urgent" ? (
                                <WarningIcon style={{ color: "red" }} />
                              ) : req.data.priority === "Medium" ? (
                                <DragHandleIcon style={{ color: "orange" }} />
                              ) : (
                                <KeyboardDoubleArrowDownRoundedIcon
                                  style={{ color: "blue" }}
                                />
                              )}
                            </p>
                          </div>
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
