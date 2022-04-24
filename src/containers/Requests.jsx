import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  List,
  ListItem,
  Grid,
  Pagination,
  Box,
  Tooltip,
} from "@mui/material";
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

export default function Requests({ prevPage, setRequests = null }) {
  let navigate = useNavigate();
  const user = useLiveQuery(() =>
    dexieDB.table("users").toCollection().first()
  );

  const [position, setPosition] = useState(null);
  const [filters, setFilters] = useState(null);
  const [sorting, setSorting] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  const [allFilteredReqs, setAllFilteredReqs] = useState([]);
  const [requestsToShow, setRequestsToShow] = useState([]);
  const [requestsAlt, setRequestsAlt] = useState([]);
  const [emptyReqMsg, setEmptyReqMsg] = useState("");
  const [page, setPage] = useState(1);

  const filtersNeeded = () => {
    return (
      prevPage !== "/archive" &&
      prevPage !== "/track-requests" &&
      prevPage !== "/pending-requests"
    );
  };

  const handlePageChange = (_, p) => setPage(p);

  useEffect(() => {
    (async () => {
      if (!user) return;

      const currentUserEmail = user.email;
      const pos = user.position;
      setPosition(pos);

      try {
        let querySnapshot, qs;

        switch (prevPage) {
          case "/my-work": {
            querySnapshot = await getTechnicianRequests(currentUserEmail);
            setEmptyReqMsg("You haven't picked up any requests.");
            break;
          }
          case "/track-requests": {
            querySnapshot = await getTrackedRequests(currentUserEmail);
            qs = await getApprovedRequests(currentUserEmail);
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

        let { reqArr, reqArrAlt } = prepareReqArr(querySnapshot, qs, pos);

        reqArr.sort((x, y) => x.data.time - y.data.time);
        reqArrAlt.sort((x, y) => x.data.time - y.data.time);

        setAllFilteredReqs(reqArr);
        setAllRequests(reqArr);
        if (!!setRequests) setRequests(reqArr);
        setRequestsAlt(reqArrAlt);
      } catch (error) {
        console.warn(error);
      }
    })();
  }, [user]);

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
      allFilteredReqs.slice(
        (page - 1) * REQUESTS_PER_PAGE,
        page * REQUESTS_PER_PAGE
      )
    );
  }, [allFilteredReqs, page]);

  function prepareReqArr(querySnapshot, qs, pos) {
    let reqArr = [],
      reqArrAlt = [];

    if (prevPage === "/pending-requests") {
      querySnapshot.forEach((doc) => {
        if (!doc.data().technicianInCharge) {
          reqArr.push({ data: doc.data() });
        } else {
          reqArrAlt.push({ data: doc.data() });
        }
      });
    } else if (prevPage === "/track-requests" && pos === "Supervisor") {
      querySnapshot.forEach((doc) => {
        reqArr.push({ data: doc.data() });
      });
      qs.forEach((doc) => {
        reqArrAlt.push({ data: doc.data() });
      });
    } else {
      querySnapshot.forEach((doc) => {
        reqArr.push({ data: doc.data() });
      });
    }

    return { reqArr, reqArrAlt };
  }

  function getIncompleteRequests() {
    return getDocs(query(collectionGroup(getFirestore(), "requests")));
  }

  function getTechnicianRequests(currentUserEmail) {
    return getDocs(
      query(
        collectionGroup(getFirestore(), "requests"),
        where("technicianInCharge", "==", currentUserEmail)
      )
    );
  }

  function getTrackedRequests(currentUserEmail) {
    return getDocs(
      query(
        collectionGroup(getFirestore(), "requests"),
        where("email", "==", currentUserEmail)
      )
    );
  }

  function getApprovedRequests(currentUserEmail) {
    return getDocs(
      query(
        collectionGroup(getFirestore(), "requests"),
        where("supervisor", "==", currentUserEmail)
      )
    );
  }

  function getPendingRequests(currentUserEmail) {
    return getDocs(
      query(
        collectionGroup(getFirestore(), "requests"),
        where("supervisor", "==", currentUserEmail),
        where("status", "==", "Pending approval")
      )
    );
  }

  function requestToJSX(req) {
    return (
      <ListItem key={req.data.id}>
        <Button
          style={{ width: "100%", minWidth: "300px" }}
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
                  <Tooltip title={`Priority: ${req.data.priority}`}>
                    <WarningIcon style={{ color: "red" }} />
                  </Tooltip>
                ) : req.data.priority === "Medium" ? (
                  <Tooltip title={`Priority: ${req.data.priority}`}>
                    <DragHandleIcon style={{ color: "orange" }} />
                  </Tooltip>
                ) : (
                  <Tooltip title={`Priority: ${req.data.priority}`}>
                    <KeyboardDoubleArrowDownRoundedIcon
                      style={{ color: "blue" }}
                    />
                  </Tooltip>
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
          <Grid item xs={12} sm={12} md={3}>
            <Filters setFilters={setFilters} setSorting={setSorting} />
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={filtersNeeded() ? 9 : 12}>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            {position !== "Supervisor" && (
              <Pagination
                count={Math.ceil(allFilteredReqs.length / REQUESTS_PER_PAGE)}
                page={page}
                onChange={handlePageChange}
              />
            )}
          </Box>
          {prevPage === "/pending-requests" && <h2>From students</h2>}
          {prevPage === "/track-requests" && position === "Supervisor" ? (
            <h2>Your requests</h2>
          ) : undefined}
          {requestsToShow.length > 0 ? (
            <List>{requestsToShow.map(requestToJSX)}</List>
          ) : (
            <p>{emptyReqMsg}</p>
          )}
          {prevPage === "/pending-requests" && <h2>From technicians</h2>}
          {prevPage === "/track-requests" && position === "Supervisor" ? (
            <h2>Your approved requests</h2>
          ) : undefined}
          {(prevPage === "/pending-requests" ||
            prevPage === "/track-requests") &&
          position === "Supervisor" ? (
            requestsAlt.length > 0 ? (
              <List>{requestsAlt.map(requestToJSX)}</List>
            ) : (
              <p>{emptyReqMsg}</p>
            )
          ) : undefined}
        </Grid>
      </Grid>
    </div>
  );
}
