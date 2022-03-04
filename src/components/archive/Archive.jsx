import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, List, ListItem, Grid, Box, Pagination } from "@mui/material";
import {
  collectionGroup,
  query,
  getFirestore,
  collection,
  orderBy,
  getDocs,
  getDoc,
  doc,
  startAfter,
  limit,
} from "firebase/firestore";
import { useLiveQuery } from "dexie-react-hooks";

import { db as dexieDB } from "../../config/db";
import Navbar from "../navbar/Navbar";
import { REQUESTS_PER_PAGE } from "../../config/constants";

export default function Archive() {
  let navigate = useNavigate();
  const users = useLiveQuery(() => dexieDB.users.toArray());

  const [sorting, setSorting] = useState("desc"); // "desc" | "asc"
  const [accRequests, setAccRequests] = useState([]);
  const [requestsToShow, setRequestsToShow] = useState([]);
  const [lastReq, setLastReq] = useState();
  const [isEnd, setIsEnd] = useState(false);
  const emptyReqMsg = "There are no completed requests.";
  const [totalArchived, setTotalArchived] = useState(0);
  const [page, setPage] = useState(1);
  const [baseQuery, setBaseQuery] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const handlePageChange = (_, newPage) =>
    newPage > page ? nextPageRequests(newPage) : prevPageRequests(newPage);

  useEffect(() => {
    if (!users || !users[0]?.position) return;
    const pos = users[0].position;
    const userId = users[0].userId;

    // Get archived request count and set the total number of pages
    if (pos === "Technician") {
      getTotalArhived();
    } else {
      getUserArchived(userId);
    }

    setBaseQuery(getQuery(pos, userId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  useEffect(() => {
    if (!baseQuery) return;
    (async () => {
      try {
        const querySnapshot = await getDocs(
          query(baseQuery, orderBy("time", sorting), limit(REQUESTS_PER_PAGE))
        );
        const docArr = querySnapshot.docs;
        const reqArr = docArr.map((req) => req.data());

        // Set requests to be seen on page
        setRequestsToShow(reqArr);

        // Set accumulated requests
        setAccRequests(reqArr);

        // Set if all archived requests have been downloaded
        setIsEnd(reqArr.length >= totalArchived); // Maybe not needed

        // Set last request for pagination
        const lastReqDoc = docArr[docArr.length - 1];
        setLastReq(lastReqDoc);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseQuery]);

  async function getTotalArhived() {
    try {
      const countRef = doc(getFirestore(), "metadata", "count");
      const countSnap = await getDoc(countRef);
      const totalArchived = countSnap.data().totalArchived;
      setTotalArchived(totalArchived);
    } catch (error) {
      console.warn(error);
    }
  }

  async function getUserArchived(userId) {
    try {
      const userRef = doc(getFirestore(), "users", userId);
      const userSnap = await getDoc(userRef);
      const archivedCount = userSnap.data().archivedRequests;
      setTotalArchived(archivedCount);
    } catch (error) {
      console.warn(error);
    }
  }

  function getQuery(pos, userId) {
    return pos === "Technician"
      ? query(collectionGroup(getFirestore(), "archive"))
      : query(collection(getFirestore(), "users", userId, "archive"));
  }

  async function nextPageRequests(newPage) {
    if (accRequests.length >= newPage * REQUESTS_PER_PAGE) {
      // Means the next page is already downloaded
      const newShowedReqs = accRequests.slice(
        REQUESTS_PER_PAGE * (newPage - 1),
        REQUESTS_PER_PAGE * newPage
      );
      setRequestsToShow(newShowedReqs);
      setPage(newPage);
      return;
    }

    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(
        query(
          baseQuery,
          orderBy("time", sorting),
          startAfter(lastReq),
          limit(REQUESTS_PER_PAGE)
        )
      );
      const docArr = querySnapshot.docs;
      const reqArr = docArr.map((req) => req.data());

      // Set requests to be seen on page
      setRequestsToShow(reqArr);

      // Set accumulated requests
      const newAccRequests = [...accRequests, ...reqArr];
      setAccRequests(newAccRequests);

      // Set if all archived requests have been downloaded
      setIsEnd(newAccRequests.length >= totalArchived); // Maybe not needed

      // Set last request for pagination
      const lastReqDoc = docArr[docArr.length - 1];
      setLastReq(lastReqDoc);
    } catch (error) {
      console.warn(error);
    }
    setIsLoading(false);
    setPage(newPage);
  }

  function prevPageRequests(newPage) {
    // Set requests to be seen on page
    const newShowedReqs = accRequests.slice(
      REQUESTS_PER_PAGE * (newPage - 1),
      REQUESTS_PER_PAGE * newPage
    );
    setRequestsToShow(newShowedReqs);
    setPage(newPage);
  }

  function requestToJSX(req) {
    return (
      <ListItem key={req.id}>
        <Button
          onClick={() =>
            navigate("/review-request", {
              state: {
                data: req,
                prevPage: "/archive",
              },
            })
          }
          variant="outlined"
          className="list-of-request-button"
        >
          <div className="list-of-request-item">
            <div>
              <p>
                <b className="id">{req.id} </b>
                {new Date(req.time.seconds * 1000).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="para">
                <b className="id status">{req.status}</b>
              </p>
            </div>
          </div>
        </Button>
      </ListItem>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="box">
        <div className="page-title">Archive</div>
        <div className="white-container">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Pagination
                  count={Math.ceil(totalArchived / REQUESTS_PER_PAGE)}
                  page={page}
                  onChange={handlePageChange}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              {isLoading ? (
                <p>Loading...</p>
              ) : requestsToShow.length > 0 ? (
                <List>{requestsToShow.map(requestToJSX)}</List>
              ) : (
                <p>{emptyReqMsg}</p>
              )}
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}
