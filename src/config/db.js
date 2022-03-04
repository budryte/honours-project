import Dexie from "dexie";

// Change version every time you change anything in the stores
export const db = new Dexie("myDatabase");
db.version(11).stores({
  users: "++id, userId, position, email, firstname, lastname, isAdmin",
});
