import React, { useEffect, useMemo, useState, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Grid, List, ListItem } from "@mui/material";
import {
  query,
  where,
  getDocs,
  getFirestore,
  getDoc,
  doc,
  collection,
} from "firebase/firestore";
import { disciplineValues, projectTypeValues } from "../../config/constants";

const statusValues = [
  "In progress",
  "Pending approval",
  "Waiting on technician",
  "Waiting on materials",
  "Waiting to be collected",
];

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Charts({ requests = [] }) {
  const [technicians, setTechnicians] = useState([]);
  const [totalArchived, setTotalArchived] = useState(0);

  const chartObj = useRef(
    disciplineValues.reduce(
      (acc, cur) => ({
        ...acc,
        disciplines: {
          ...acc.disciplines,
          [cur]: 0,
        },
      }),
      projectTypeValues.reduce(
        (acc, cur) => ({
          ...acc,
          types: {
            ...acc.types,
            [cur]: 0,
          },
        }),
        statusValues.reduce(
          (acc, cur) => ({
            ...acc,
            status: {
              ...acc.status,
              [cur]: 0,
            },
          }),
          {}
        )
      )
    )
  ).current;

  const sortedRequests = useMemo(
    () =>
      requests.reduce((acc, cur) => {
        let curStatus = cur.data.status;
        let curType = Object.keys(chartObj.types).includes(cur.data.projectType)
          ? cur.data.projectType
          : "Other";
        let curDisp = Object.keys(chartObj.disciplines).includes(
          cur.data.discipline
        )
          ? cur.data.discipline
          : "Other";

        return {
          status: {
            ...acc.status,
            [curStatus]: acc.status[curStatus] + 1,
          },
          types: {
            ...acc.types,
            [curType]: acc.types[curType] + 1,
          },
          disciplines: {
            ...acc.disciplines,
            [curDisp]: acc.disciplines[curDisp] + 1,
          },
        };
      }, chartObj),
    [requests]
  );

  const statusData = {
    labels: Object.keys(chartObj.status),
    datasets: [
      {
        data: Object.keys(chartObj.status).map(
          (key) => sortedRequests.status[key]
        ),
        label: "# of Votes",
        backgroundColor: [
          "#7180AC",
          "#2B4570",
          "#A8D0DB",
          "#E49273",
          "#A37A74",
        ],
      },
    ],
  };

  const typeData = {
    labels: Object.keys(chartObj.types),
    datasets: [
      {
        data: Object.keys(chartObj.types).map(
          (key) => sortedRequests.types[key]
        ),
        label: "# of Votes",
        backgroundColor: [
          //   "#CAE7B9",
          //   "#F3DE8A",
          //   "#EB9486",
          //   "#7E7F9A",
          //   "#97A7B3",
          "#C0CAAD",
          "#654C4F",
          "#B26E63",
          "#CEC075",
          "#9DA9A0",
          "#C89B7B",
        ],
      },
    ],
  };

  const disciplineData = {
    labels: Object.keys(chartObj.disciplines),
    datasets: [
      {
        label: "# of Votes",
        data: Object.keys(chartObj.disciplines).map(
          (key) => sortedRequests.disciplines[key]
        ),
        backgroundColor: [
          "#7180AC",
          "#2B4570",
          "#A8D0DB",
          "#E49273",
          "#A37A74",
          "#C89B7B",
          "#97A7B3",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        align: "left",
        display: true,
      },
    },
  };

  useEffect(() => {
    const db = getFirestore();
    getDocs(
      query(collection(db, "users"), where("position", "==", "Technician"))
    )
      .then((snap) => {
        let techArr = [];

        snap.forEach((document) => {
          techArr.push({
            id: document.id,
            data: document.data(),
          });
        });

        setTechnicians(techArr);
      })
      .catch(console.warn);
  }, []);

  useEffect(() => {
    const countRef = doc(getFirestore(), "metadata", "count");
    getDoc(countRef)
      .then((snap) => snap.data())
      .then((data) => data.totalArchived)
      .then(setTotalArchived)
      .catch(console.warn);
  }, []);

  return (
    <div className="white-container">
      <h2>Total Active Requests: {requests.length} </h2>
      <Grid container spacing={4}>
        <Grid item xs={9} sm={6} md={4}>
          <div className="chart">
            <h2>Status</h2>
            <Doughnut options={options} data={statusData} />
          </div>
        </Grid>
        <Grid item xs={9} sm={6} md={4}>
          <div className="chart">
            <h2>Project Type</h2>
            <Doughnut options={options} data={typeData} />
          </div>
        </Grid>
        <Grid item xs={9} sm={6} md={4}>
          <div className="chart">
            <h2>Project Discipline</h2>
            <Doughnut options={options} data={disciplineData} />
          </div>
        </Grid>
      </Grid>

      <h2 style={{ marginBottom: 0, marginTop: "50px" }}>
        Picked-up requests:
      </h2>
      {technicians.length > 0 ? (
        <List>
          {technicians.map((tech) => (
            <ListItem key={tech.id}>
              <div className="tech-item">
                {tech.data.firstname} {tech.data.lastname}:{" "}
                {tech.data.pickedUp ?? 0}
              </div>
            </ListItem>
          ))}
        </List>
      ) : (
        <p>There are no technicians.</p>
      )}

      <h2>Total Archived Requests: {totalArchived} </h2>
    </div>
  );
}
