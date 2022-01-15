import Dexie from "dexie";

export const db = new Dexie("myDatabase");
db.version(7).stores({
  //   friends: '++id, name, age', // Primary key and indexed props
  users: "++id, position",
});
