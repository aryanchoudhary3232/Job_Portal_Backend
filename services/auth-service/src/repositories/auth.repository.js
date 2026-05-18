import { db } from "../../../../shared/src/storage/json-store.js";

export const findUserByEmail = (email) =>
  db.read().users.find((user) => user.email.toLowerCase() === email.toLowerCase());

export const findUserById = (id) => db.read().users.find((user) => user.id === id);

export const createUser = (user) =>
  db.update((state) => {
    state.users.push(user);
    return state;
  }).users.find((entry) => entry.id === user.id);
