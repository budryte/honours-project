import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, List, ListItem, Grid } from "@mui/material";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import WarningIcon from "@mui/icons-material/Warning";

import Filters from "./Filters";
import {
  collectionGroup,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { useLiveQuery } from "dexie-react-hooks";
import { db as dexieDB } from "../../config/db";

export default function Requests({ prevPage }) {
  let navigate = useNavigate();
  const users = useLiveQuery(() => dexieDB.users.toArray());

  const filtersNeeded = () => {
    if (prevPage === "/archive") {
      return false;
    }
    if (prevPage === "/track-requests") {
      return false;
    }
    if (prevPage === "/pending-requests") {
      return false;
    }
    return true;
  };

  const [filters, setFilters] = useState(null);
  const [sorting, setSorting] = useState(null);
  const [requests, setRequests] = useState([]);
  const [requestsAlt, setRequestsAlt] = useState([]);

  const [emptyReqMsg, setEmptyReqMsg] = useState("");

  useEffect(() => {
    (async () => {
      if (!users || !users[0] || !users[0].email) return;

      const currentUserEmail = users[0].email;
      const pos = users[0].position;

      try {
        let querySnapshot;

        switch (prevPage) {
          case "/my-work": {
            querySnapshot = await getTechnicianRequests(currentUserEmail);
            setEmptyReqMsg("There are no active requests.");
            break;
          }
          case "/archive": {
            querySnapshot = await getArchivedRequests(currentUserEmail, pos);
            setEmptyReqMsg("There are no completed requests.");
            break;
          }
          case "/track-requests": {
            querySnapshot = await getTrackedRequests(currentUserEmail);
            setEmptyReqMsg("You have no active requests.");
            break;
          }
          case "/pending-requests": {
            querySnapshot = await getPendingRequests(currentUserEmail);
            setEmptyReqMsg("There are no pending requests.");
            break;
          }
          default:
            // "/list-of-requests"
            querySnapshot = await getIncompleteRequests();
            setEmptyReqMsg("There are no requests in the queue.");
        }

        let { reqArr, reqArrAlt } = prepareReqArr(querySnapshot);

        reqArr.sort(function (x, y) {
          return x.data.time - y.data.time;
        });
        reqArrAlt.sort(function (x, y) {
          return x.data.time - y.data.time;
        });

        setRequests(reqArr);
        setRequestsAlt(reqArrAlt);
      } catch (error) {
        console.warn(error);
      }
    })();
  }, [users]);

  function prepareReqArr(querySnapshot) {
    let reqArr = [],
      reqArrAlt = [];

    if (prevPage !== "/pending-requests") {
      querySnapshot.forEach((doc) => {
        reqArr.push({ parentId: doc.ref.parent.parent.id, data: doc.data() });
      });
    } else {
      querySnapshot.forEach((doc) => {
        if (!doc.data().technicianInCharge) {
          reqArr.push({
            parentId: doc.ref.parent.parent.id,
            data: doc.data(),
          });
        } else {
          reqArrAlt.push({
            parentId: doc.ref.parent.parent.id,
            data: doc.data(),
          });
        }
      });
    }

    return { reqArr, reqArrAlt };
  }

  function getIncompleteRequests() {
    return getDocs(
      query(
        collectionGroup(getFirestore(), "requests"),
        where("status", "!=", "Completed")
      )
    );
  }

  function getTechnicianRequests(currentUserEmail) {
    return getDocs(
      query(
        collectionGroup(getFirestore(), "requests"),
        where("technicianInCharge", "==", currentUserEmail),
        where("status", "!=", "Completed")
      )
    );
  }

  function getArchivedRequests(currentUserEmail, pos) {
    if (pos === "Technician") {
      return getDocs(
        query(
          collectionGroup(getFirestore(), "requests"),
          where("status", "==", "Completed")
        )
      );
    } else {
      return getDocs(
        query(
          collectionGroup(getFirestore(), "requests"),
          where("email", "==", currentUserEmail),
          where("status", "==", "Completed")
        )
      );
    }
  }

  function getTrackedRequests(currentUserEmail) {
    return getDocs(
      query(
        collectionGroup(getFirestore(), "requests"),
        where("email", "==", currentUserEmail),
        where("status", "!=", "Completed")
      )
    );
  }

  function getPendingRequests(currentUserEmail) {
    return getDocs(
      query(
        collectionGroup(getFirestore(), "requests"),
        where("supervisor", "==", currentUserEmail),
        where("email", "!=", currentUserEmail),
        where("status", "==", "Pending approval")
      )
    );
  }

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

  useEffect(() => {
    if (!sorting) return;

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

  function requestToJSX(req) {
    return (
      <ListItem key={req.data.id}>
        <Button
          onClick={() =>
            navigate("/pick-up-request", {
              state: {
                data: req.data,
                parentId: req.parentId,
                prevPage: prevPage,
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
                {new Date(req.data.time.seconds * 1000).toLocaleDateString()}
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
    );
  }

  return (
    <div className="white-container">
      <Grid container spacing={2}>
        {filtersNeeded() && (
          <Grid item xs={3}>
            <Filters setFilters={setFilters} setSorting={setSorting} />
          </Grid>
        )}
        <Grid item xs={filtersNeeded() ? 9 : 12}>
          {prevPage === "/pending-requests" && <h2>From students</h2>}
          {requests.length > 0 ? (
            <List>{requests.map(requestToJSX)}</List>
          ) : (
            <p>{emptyReqMsg}</p>
          )}
          {prevPage === "/pending-requests" && <h2>From technicians</h2>}
          {prevPage === "/pending-requests" &&
            (requestsAlt.length > 0 ? (
              <List>{requestsAlt.map(requestToJSX)}</List>
            ) : (
              <p>{emptyReqMsg}</p>
            ))}
        </Grid>
      </Grid>
    </div>
  );
}
