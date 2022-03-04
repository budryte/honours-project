import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, List, ListItem, Grid, Pagination, Box } from "@mui/material";
import {
  Warning as WarningIcon,
  DragHandle as DragHandleIcon,
  KeyboardDoubleArrowDownRounded as KeyboardDoubleArrowDownRoundedIcon,
} from "@mui/icons-material";
import Filters from "../components/small-components/Filters";
import {
  collectionGroup,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { useLiveQuery } from "dexie-react-hooks";
import { db as dexieDB } from "../config/db";
import { REQUESTS_PER_PAGE } from "../config/constants";

export default function Requests({ prevPage }) {
  let navigate = useNavigate();
  const users = useLiveQuery(() => dexieDB.users.toArray());

  const [filters, setFilters] = useState(null);
  const [sorting, setSorting] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  const [allFilteredReqs, setAllFilteredReqs] = useState([]);
  const [requestsToShow, setRequestsToShow] = useState([]);
  const [requestsAlt, setRequestsAlt] = useState([]);
  const [emptyReqMsg, setEmptyReqMsg] = useState("");
  const [page, setPage] = useState(1);

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

  const paginationNeeded = () => {
    return true;
  };

  const handlePageChange = (_, p) => setPage(p);

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

        setAllFilteredReqs(reqArr);
        setAllRequests(reqArr);
        setRequestsAlt(reqArrAlt);
      } catch (error) {
        console.warn(error);
      }
    })();
  }, [users]);

  useEffect(() => {
    if (!filters) return;

    if (filters === "cleared") {
      setAllFilteredReqs(allRequests);
      return;
    }

    let filteredRequests = allRequests.filter((req) => {
      if (!filters.status) {
        return req.data.priority === filters.priority;
      } else if (!filters.priority) {
        return req.data.status === filters.status;
      } else {
        return (
          req.data.status === filters.status &&
          req.data.priority === filters.priority
        );
      }
    });

    if (filteredRequests.length > 0) {
      if (!sorting || sorting.sortingType === "newest last") {
        filteredRequests.sort((x, y) => x.data.time - y.data.time);
      } else {
        filteredRequests.sort((x, y) => y.data.time - x.data.time);
      }
    }

    setAllFilteredReqs(filteredRequests);
  }, [filters]);

  useEffect(() => {
    if (!sorting) return;

    let reqArr = [...allFilteredReqs];

    if (sorting.sortingType === "newest first") {
      reqArr.sort((x, y) => y.data.time - x.data.time);
    } else {
      reqArr.sort((x, y) => x.data.time - y.data.time);
    }

    setAllFilteredReqs(reqArr);
  }, [sorting]);

  useEffect(() => {
    setRequestsToShow(
      !paginationNeeded()
        ? allFilteredReqs
        : allFilteredReqs.slice(
            (page - 1) * REQUESTS_PER_PAGE,
            page * REQUESTS_PER_PAGE
          )
    );
  }, [allFilteredReqs, page]);

  function prepareReqArr(querySnapshot) {
    let reqArr = [],
      reqArrAlt = [];

    if (prevPage !== "/pending-requests") {
      querySnapshot.forEach((doc) => {
        reqArr.push({ data: doc.data() });
      });
    } else {
      querySnapshot.forEach((doc) => {
        if (!doc.data().technicianInCharge) {
          reqArr.push({ data: doc.data() });
        } else {
          reqArrAlt.push({ data: doc.data() });
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

  function requestToJSX(req) {
    return (
      <ListItem key={req.data.id}>
        <Button
          onClick={() =>
            navigate("/review-request", {
              state: {
                data: req.data,
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
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Pagination
              count={Math.ceil(allFilteredReqs.length / REQUESTS_PER_PAGE)}
              page={page}
              onChange={handlePageChange}
            />
          </Box>
          {prevPage === "/pending-requests" && <h2>From students</h2>}
          {requestsToShow.length > 0 ? (
            <List>{requestsToShow.map(requestToJSX)}</List>
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
