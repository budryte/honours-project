// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.deleteUserFromFireStore = functions
  .region("europe-west1")
  .auth.user()
  .onDelete((user) => {
    return db.collection("users").doc(user.uid).delete();
  });
