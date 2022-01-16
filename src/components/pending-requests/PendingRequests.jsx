import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {
  collectionGroup,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { useLiveQuery } from "dexie-react-hooks";
import { db as dexieDB } from "../../config/db";

import "./pending-requests.scss";

export default function PendingRequests() {
  let navigate = useNavigate();
  const users = useLiveQuery(() => dexieDB.users.toArray());
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!users || !users[0] || !users[0].email) return;
    const currentUserEmail = users[0].email;

    (async () => {
      const querySnapshot = await getDocs(
        query(
          collectionGroup(getFirestore(), "requests"),
          where("supervisor", "==", currentUserEmail)
          // where("supervisor", "==", "Pending Approval")
        )
      );
      let reqArr = [];
      querySnapshot.forEach((doc) => {
        reqArr.push({ id: doc.id, data: doc.data() });
      });
      setRequests(reqArr);
    })();
  }, [users]);

  return (
    <div>
      <Navbar />
      <div className="box">
        <div className="page-title">Pending Requests</div>
        <div className="white-container">
          <h2>From students</h2>
          {requests.length > 0 ? (
            <List>
              {requests.map((req) => (
                <ListItem key={req.data.id}>
                  <div className="pending-request-list-item">
                    <p>
                      <b>{req.data.id}</b>
                    </p>
                    <Button
                      onClick={() =>
                        navigate("/review-pending-request", {
                          state: req.data,
                        })
                      }
                    >
                      Review
                    </Button>
                  </div>
                </ListItem>
              ))}
            </List>
          ) : (
            <p>There are no pending requests.</p>
          )}

          <h2>From technicians</h2>
          {/* todo: if pending request exists, then show list */}
          {/* <List>
            <ListItem></ListItem>
          </List> */}
          <p>There are no pending requests.</p>
        </div>
      </div>
    </div>
  );
}
