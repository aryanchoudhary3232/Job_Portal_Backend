import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defaultData } from "./default-data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "../../data/runtime-db.json");

const ensureDb = () => {
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
  }
};

const readDb = () => {
  ensureDb();
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
};

const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  return data;
};

export const db = {
  read: readDb,
  write: writeDb,
  update: (updater) => writeDb(updater(readDb())),
};
