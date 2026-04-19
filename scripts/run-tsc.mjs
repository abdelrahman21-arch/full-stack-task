import { spawn } from "node:child_process";
import { resolvePnpmPackageFile } from "./resolve-pnpm-bin.mjs";

const tscPath = resolvePnpmPackageFile("typescript", "lib/tsc.js");

const child = spawn(process.execPath, [tscPath, ...process.argv.slice(2)], {
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
