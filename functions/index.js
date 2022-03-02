const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.deleteUserFromFireStore = functions
  .region("europe-west1")
  .auth.user()
  .onDelete((user) => {
    return db.collection("users").doc(user.uid).delete();
  });

exports.addTwentyRandomRequests = functions
  .region("europe-west1")
  .https.onRequest((_req, res) => {
    const disciplineValues = [
      "Mech Eng",
      "Civil CTU",
      "Civil Geotechs",
      "CAHID",
      "LRCFS",
      "Other",
    ];
    const projectTypeValues = [
      "Hons",
      "MSc",
      "PhD",
      "Research",
      "Teaching",
      "Other",
    ];
    const priorityValues = ["Low", "Medium", "Urgent"];
    const statusValues = [
      "Pending approval",
      "In progress",
      "Waiting on technician",
      "Waiting on materials",
      "Waiting to be collected",
      "Completed",
    ];

    const userId = "1Inoljg4cegX90rce00cgM2nr962";
    const firstTime = 1600000000000;

    let randomDocs = [];
    for (let i = 0; i < 20; i++) {
      randomDocs.push({
        approvalRequired: "Yes",
        discipline:
          disciplineValues[Math.floor(Math.random() * disciplineValues.length)],
        email: "lucy.white@gmail.com",
        extraInfo: "randomTestDoc",
        firstname: "Lucy",
        id: `RTA${(firstTime + i).toString()}`,
        lastname: "White",
        linkToFolder: "https://theuselessweb.com/",
        priority:
          priorityValues[Math.floor(Math.random() * priorityValues.length)],
        projectType:
          projectTypeValues[
            Math.floor(Math.random() * projectTypeValues.length)
          ],
        status: statusValues[Math.floor(Math.random() * statusValues.length)],
        supervisor: "supervisor@gmail.com",
        time: admin.firestore.FieldValue.serverTimestamp(),
        userId,
      });
    }

    const batch = db.batch();
    randomDocs.forEach((randomDoc) =>
      batch.set(
        db
          .collection("users")
          .doc(userId)
          .collection("requests")
          .doc(randomDoc.id),
        randomDoc
      )
    );
    batch
      .commit()
      .then(() => res.status(200).send("20 random posts added"))
      .catch((e) => {
        console.log(e);
        res.status(500).send(e);
      });
  });

exports.deleteTestRequests = functions
  .region("europe-west1")
  .https.onRequest((_req, res) => {
    const firstTime = 1600000000000;
    const userId = "1Inoljg4cegX90rce00cgM2nr962";
    const batch = db.batch();

    for (let i = 0; i < 20; i++) {
      batch.delete(
        db
          .collection("users")
          .doc(userId)
          .collection("requests")
          .doc((firstTime + i).toString())
      );
    }

    batch
      .commit()
      .then(() => res.status(200).send("20 test posts deleted"))
      .catch((e) => {
        console.log(e);
        res.status(500).send(e);
      });
  });
