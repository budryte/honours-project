import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { Button, List, ListItem } from "@mui/material";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import WarningIcon from "@mui/icons-material/Warning";
import {
  collectionGroup,
  where,
  query,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { useLiveQuery } from "dexie-react-hooks";
import { db as dexieDB } from "../../config/db";

export default function MyWork() {
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
          where("technicianInCharge", "==", currentUserEmail),
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
        <div className="page-title">My Work</div>
        <div className="list-container">
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
                          prevPage: "/my-work",
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
                          {}
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
            <p>There are no pending requests.</p>
          )}
        </div>
      </div>
    </div>
  );
}
