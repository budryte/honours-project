import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { Button, List, ListItem } from "@mui/material";
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

  useEffect(() => {
    (async () => {
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
    })();
  }, [users]);

  return (
    <div>
      <Navbar />
      <div className="box">
        <div className="page-title">List of Requests</div>
        <div className="list-container">
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
        </div>
      </div>
    </div>
  );
}
