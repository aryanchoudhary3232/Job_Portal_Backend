import { db } from "../../../../shared/src/storage/json-store.js";

export const readPortalState = () => db.read();
