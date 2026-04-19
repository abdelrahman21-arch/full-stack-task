import { spawn } from "node:child_process";
import { resolve } from "node:path";

const rootDir = process.cwd();
const children = [];

function spawnManaged(label, cwd, script, args) {
  const child = spawn(process.execPath, [resolve(rootDir, script), ...args], {
    cwd: resolve(rootDir, cwd),
    env: process.env,
    stdio: ["inherit", "pipe", "pipe"],
  });

  const prefix = `[${label}] `;

  child.stdout.on("data", (chunk) => {
    process.stdout.write(
      String(chunk)
        .split(/\r?\n/)
        .filter((line, index, arr) => line.length > 0 || index < arr.length - 1)
        .map((line) => `${prefix}${line}`)
        .join("\n") + "\n",
    );
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(
      String(chunk)
        .split(/\r?\n/)
        .filter((line, index, arr) => line.length > 0 || index < arr.length - 1)
        .map((line) => `${prefix}${line}`)
        .join("\n") + "\n",
    );
  });

  child.on("exit", (code) => {
    if (code && code !== 0) {
      process.exitCode = code;
      for (const runningChild of children) {
        if (!runningChild.killed) {
          runningChild.kill();
        }
      }
    }
  });

  children.push(child);
}

spawnManaged("web", "apps/web", "scripts/run-next.mjs", ["dev"]);
spawnManaged("server", "apps/server", "scripts/run-tsx.mjs", ["watch", "src/index.ts"]);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    for (const child of children) {
      if (!child.killed) {
        child.kill(signal);
      }
    }
    process.exit(0);
  });
}

