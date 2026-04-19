import { spawn } from "node:child_process";
import { resolvePnpmPackageFile } from "./resolve-pnpm-bin.mjs";

const tsxPath = resolvePnpmPackageFile("tsx", "dist/cli.mjs");

const child = spawn(process.execPath, [tsxPath, ...process.argv.slice(2)], {
  stdio: "inherit",
  cwd: process.cwd(),
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
