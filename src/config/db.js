import Dexie from "dexie";

export const db = new Dexie("myDatabase");
db.version(9).stores({
  //   friends: '++id, name, age', // Primary key and indexed props
  users: "++id, position, email, firstname, lastname",
});
