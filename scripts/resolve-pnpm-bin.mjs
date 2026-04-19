import { existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");
const pnpmDir = join(rootDir, "node_modules", ".pnpm");

export function resolvePnpmPackageFile(packagePrefix, relativeFile) {
  const entries = readdirSync(pnpmDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(`${packagePrefix}@`))
    .map((entry) => entry.name)
    .sort((left, right) => right.localeCompare(left));

  for (const entry of entries) {
    const packagePath = join(pnpmDir, entry, "node_modules", packagePrefix, relativeFile);
    if (existsSync(packagePath)) {
      return packagePath;
    }
  }

  throw new Error(`Unable to resolve ${packagePrefix}/${relativeFile} from ${pnpmDir}`);
}

