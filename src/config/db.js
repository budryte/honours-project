import Dexie from "dexie";

// Change version every time you change anything in the stores
export const db = new Dexie("myDatabase");
db.version(10).stores({
  users: "++id, position, email, firstname, lastname, isAdmin",
});
