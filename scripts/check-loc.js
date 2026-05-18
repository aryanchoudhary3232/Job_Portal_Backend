import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const ignored = ["node_modules", ".git", "prisma", "public"];
const allowedExt = new Set([".js", ".ts", ".tsx", ".mjs", ".cjs", ".css"]);
const violations = [];

const walk = (dirPath) => {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (ignored.includes(entry.name)) {
      continue;
    }
    const filePath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walk(filePath);
      continue;
    }
    if (!allowedExt.has(path.extname(entry.name))) {
      continue;
    }
    const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/).length;
    if (lines > 200) {
      violations.push({ filePath, lines });
    }
  }
};

walk(rootDir);

if (violations.length) {
  console.error("LOC violations found:");
  for (const item of violations) {
    console.error(`${item.lines} ${path.relative(rootDir, item.filePath)}`);
  }
  process.exit(1);
}

console.log("All source files are within the 200 line limit.");
