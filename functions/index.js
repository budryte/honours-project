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

exports.moveCompletedRequestToArchive = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}/requests/{requestId}")
  .onUpdate(async (change, _context) => {
    const newData = change.after;
    const oldData = change.before.data();
    const request = newData.data();
    const batch = db.batch();

    /* If request is completed, move it to the 'archive' collection */
    if (request.status === "Completed" && oldData.status !== "Completed") {
      batch.create(
        db.doc(`users/${request.userId}/archive/${request.id}`),
        request
      );
      batch.delete(db.doc(`users/${request.userId}/requests/${request.id}`));

      batch.update(db.doc(`users/${request.userId}`), {
        archivedRequests: admin.firestore.FieldValue.increment(1),
      });
      batch.update(db.doc(`metadata/count`), {
        totalArchived: admin.firestore.FieldValue.increment(1),
      });
    }

    /* If request technicians-in-charge change, update the technician's picked-up counter */
    if (request.technicianInCharge !== oldData.technicianInCharge) {
      const newSnap = await db
        .collection("users")
        .where("email", "==", request.technicianInCharge)
        .get();
      const newTechnician = newSnap.docs.length > 0 ? newSnap.docs[0] : null;
      if (!!newTechnician) {
        batch.update(newTechnician.ref, {
          pickedUp: admin.firestore.FieldValue.increment(1),
        });
      }

      /* If the TIC was updated, decrement the previous technician's picked-up counter */
      if (!!oldData.technicianInCharge) {
        const oldSnap = await db
          .collection("users")
          .where("email", "==", oldData.technicianInCharge)
          .get();
        const oldTechnician = oldSnap.docs.length > 0 ? oldSnap.docs[0] : null;
        if (!!oldTechnician) {
          batch.update(oldTechnician.ref, {
            pickedUp: admin.firestore.FieldValue.increment(-1),
          });
        }
      }
    }

    try {
      return await batch.commit();
    } catch (args) {
      return functions.logger.log(args);
    }
  });

exports.updateArchiveCounter = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}/archive/{requestId}")
  .onDelete(() => {
    return db.doc(`metadata/count`).update({
      totalArchived: admin.firestore.FieldValue.increment(-1),
    });
  });

exports.updateTechnicianPosition = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}")
  .onCreate(async (userDoc) => {
    const user = userDoc.data();
    const batch = db.batch();

    if (user.position === "toBeApproved") {
      const waitingRef = db.doc("metadata/technicians");
      const waitingList = (await waitingRef.get()).data().waiting;
      if (waitingList.includes(user.email)) {
        batch.update(waitingRef, {
          waiting: admin.firestore.FieldValue.arrayRemove(user.email),
        });
        batch.update(db.doc(`users/${userDoc.id}`), { position: "Technician" });
        return batch.commit();
      }
    }
  });
