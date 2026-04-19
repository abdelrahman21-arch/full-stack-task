import { spawn } from "node:child_process";
import { resolve } from "node:path";

const rootDir = process.cwd();
const packages = [
  "packages/schemas",
  "packages/types",
  "packages/utils",
];

function runBuild(targetDir) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(process.execPath, [resolve(rootDir, "scripts/run-tsc.mjs"), "-p", "tsconfig.json"], {
      cwd: resolve(rootDir, targetDir),
      stdio: "inherit",
      env: process.env,
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolvePromise();
        return;
      }

      rejectPromise(new Error(`Build failed for ${targetDir} with exit code ${code ?? 1}`));
    });
  });
}

for (const targetDir of packages) {
  // Keep shared package builds deterministic because the later packages depend on earlier output.
  await runBuild(targetDir);
}

