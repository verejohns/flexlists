import * as fs from "fs";
import * as child_process from "child_process";
import path from "path";

const execSync = child_process.execSync;

function cloneAndPrepareRepository() {
  const repoPath = path.join("..", "Flexlists-API-Client-TS");

  // Check if directory exists
  if (!fs.existsSync(repoPath)) {
    // Clone the repository
    execSync("git clone git@github.com:Flexlists/Flexlists-API-Client-TS.git", {
      stdio: "inherit",
      cwd: "..",
    });
    execSync("yarn", { stdio: "inherit", cwd: repoPath });
  }

  // Perform Git and build operations
  execSync("git stash", { stdio: "inherit", cwd: repoPath });
  execSync("git pull", { stdio: "inherit", cwd: repoPath });
  execSync("yarn", { stdio: "inherit", cwd: repoPath });
  execSync("yarn build", { stdio: "inherit", cwd: repoPath });

  // File operations for node_modules/flexlists-api
  const modulePath = path.join("node_modules", "flexlists-api");
  const distPath = path.join(modulePath, "dist");
  if (fs.existsSync(modulePath)) {
    fs.rmSync(modulePath, { recursive: true, force: true });
  }
  if (fs.existsSync(".next")) {
    fs.rmSync(".next", { recursive: true, force: true });
  }
  fs.mkdirSync(modulePath, { recursive: true });
  fs.mkdirSync(distPath, { recursive: true });

  fs.cpSync(`${repoPath}/dist/`, distPath, { recursive: true });
  fs.cpSync(`${repoPath}/package.json`, `${modulePath}/package.json`);
}

cloneAndPrepareRepository();
