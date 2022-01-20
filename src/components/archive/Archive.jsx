import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {
  collectionGroup,
  where,
  query,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { useLiveQuery } from "dexie-react-hooks";
import { db as dexieDB } from "../../config/db";

export default function Archive() {
  let navigate = useNavigate();
  const users = useLiveQuery(() => dexieDB.users.toArray());
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!users || !users[0] || !users[0].email) return;
    const currentUserEmail = users[0].email;
    const pos = users[0].position;

    (async () => {
      let querySnapshot;
      if (pos === "Technician") {
        querySnapshot = await getDocs(
          query(
            collectionGroup(getFirestore(), "requests"),
            where("status", "==", "Completed")
          )
        );
      } else if (pos === "Supervisor") {
        querySnapshot = await getDocs(
          query(
            collectionGroup(getFirestore(), "requests"),
            where("supervisor", "==", currentUserEmail),
            where("status", "==", "Completed")
          )
        );
      } else if (pos === "Client") {
        querySnapshot = await getDocs(
          query(
            collectionGroup(getFirestore(), "requests"),
            where("email", "==", currentUserEmail),
            where("status", "==", "Completed")
          )
        );
      }
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
        <div className="page-title">Archive</div>
        <div className="list-container">
          {requests.length > 0 ? (
            <List>
              {requests.map((req) => (
                <ListItem key={req.data.id}>
                  <Button
                    onClick={() =>
                      navigate("/review-archived-request", {
                        state: { data: req.data, parentId: req.parentId },
                      })
                    }
                    className="list-of-request-button"
                  >
                    <div className="list-of-request-item">
                      <div>
                        <p>
                          <b className="id">{req.data.id} </b>
                          {"Date: "}
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
            <p>There are no completed requests.</p>
          )}
        </div>
      </div>
    </div>
  );
}
