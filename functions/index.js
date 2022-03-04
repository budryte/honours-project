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
        functions.logger.log(e);
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
        functions.logger.log(e);
        res.status(500).send(e);
      });
  });

exports.moveAllToArchive = functions
  .region("europe-west1")
  .https.onRequest((_req, _res) => {
    const requestsRef = db.collection("archive");

    requestsRef.get().then((reqsSnap) => {
      reqsSnap.forEach(async (reqSnap) => {
        try {
          const batch = db.batch();
          const reqRef = reqSnap.ref;
          const snap = await reqRef.get();
          const request = snap.data();
          batch.delete(db.doc(`archive/${request.id}`));
          batch.set(
            db.doc(`users/${request.userId}/archive/${request.id}`),
            request
          );
          batch.commit();
        } catch (e) {
          functions.logger.log(e);
        }
      });
    });
  });

exports.moveCompletedRequestToArchive = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}/requests/{requestId}")
  .onUpdate((change, _context) => {
    /* If request is completed, move it to the 'archive' collection */
    const newData = change.after;
    const request = newData.data();
    if (request.status !== "Completed") return;

    const batch = db.batch();
    batch.create(
      db.doc(`users/${request.userId}/archive/${request.id}`),
      request
    );
    batch.delete(db.doc(`users/${request.userId}/requests/${request.id}`));

    batch.update(db.doc(`users/${request.userId}`), {
      archivedRequests: admin.firestore.FieldValue.increment(),
    });
    batch.update(db.doc(`metadata/count`), {
      totalArchived: admin.firestore.FieldValue.increment(),
    });
    batch.commit().catch(functions.logger.log);
  });
