import { db } from "../../../../shared/src/storage/json-store.js";

export const listUsers = () => db.read().users;

export const findUserById = (id) => listUsers().find((user) => user.id === id);

export const updateUser = (id, patch) =>
  db.update((state) => {
    state.users = state.users.map((user) => (user.id === id ? { ...user, ...patch } : user));
    return state;
  }).users.find((user) => user.id === id);
