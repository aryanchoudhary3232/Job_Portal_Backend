import { db } from "../../../../shared/src/storage/json-store.js";

export const readPortalState = () => db.read();

export const createApplication = (application) =>
  db.update((state) => {
    state.applications.unshift(application);
    return state;
  }).applications.find((entry) => entry.id === application.id);

export const updateApplication = (id, patch) =>
  db.update((state) => {
    state.applications = state.applications.map((application) =>
      application.id === id ? { ...application, ...patch } : application,
    );
    return state;
  }).applications.find((application) => application.id === id);
