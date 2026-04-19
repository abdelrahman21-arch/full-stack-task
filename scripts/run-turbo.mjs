import { spawn } from "node:child_process";
import { resolvePnpmPackageFile } from "./resolve-pnpm-bin.mjs";

const turboPath = resolvePnpmPackageFile("turbo", "bin/turbo");

const child = spawn(process.execPath, [turboPath, ...process.argv.slice(2)], {
  stdio: "inherit",
  cwd: process.cwd(),
  env: {
    ...process.env,
    TURBO_TELEMETRY_DISABLED: "1",
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
