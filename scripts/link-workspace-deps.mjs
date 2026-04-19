import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");
const nodeModulesDir = join(rootDir, "node_modules");
const pnpmDir = join(nodeModulesDir, ".pnpm");

const packageJsonPaths = [
  "package.json",
  "apps/web/package.json",
  "apps/server/package.json",
  "packages/schemas/package.json",
  "packages/types/package.json",
  "packages/utils/package.json",
];

const workspacePackages = new Map([
  ["@repo/schemas", join(rootDir, "packages/schemas")],
  ["@repo/types", join(rootDir, "packages/types")],
  ["@repo/utils", join(rootDir, "packages/utils")],
  ["@repo/server", join(rootDir, "apps/server")],
]);

function ensureDir(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

function sanitizePackageName(packageName) {
  return packageName.replace("/", "+");
}

function resolvePnpmPackageDir(packageName) {
  const prefix = `${sanitizePackageName(packageName)}@`;
  const entries = readdirSync(pnpmDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
    .map((entry) => entry.name)
    .sort((left, right) => {
      const leftScore = Number(left.includes("_"));
      const rightScore = Number(right.includes("_"));

      if (leftScore !== rightScore) {
        return rightScore - leftScore;
      }

      return right.localeCompare(left);
    });

  for (const entry of entries) {
    const candidate = join(pnpmDir, entry, "node_modules", packageName);
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function linkPackage(packageName, target) {
  const segments = packageName.split("/");
  const linkPath = join(nodeModulesDir, ...segments);
  const parentDir = segments.length > 1 ? join(nodeModulesDir, segments[0]) : nodeModulesDir;

  ensureDir(parentDir);

  if (existsSync(linkPath)) {
    rmSync(linkPath, { recursive: true, force: true });
  }

  symlinkSync(target, linkPath, "junction");
}

function collectDependencyNames() {
  const names = new Set();

  for (const packageJsonPath of packageJsonPaths) {
    const packageJson = JSON.parse(readFileSync(join(rootDir, packageJsonPath), "utf8"));
    for (const section of ["dependencies", "devDependencies"]) {
      const deps = packageJson[section] ?? {};
      for (const name of Object.keys(deps)) {
        names.add(name);
      }
    }
  }

  return [...names].sort((left, right) => left.localeCompare(right));
}

function collectCachedPackageNames() {
  const names = new Set();
  const entries = readdirSync(pnpmDir, { withFileTypes: true }).filter((entry) => entry.isDirectory());

  for (const entry of entries) {
    const packageRoot = join(pnpmDir, entry.name, "node_modules");
    if (!existsSync(packageRoot)) {
      continue;
    }

    for (const packageEntry of readdirSync(packageRoot, { withFileTypes: true })) {
      if (!packageEntry.isDirectory()) {
        continue;
      }

      if (packageEntry.name.startsWith("@")) {
        for (const scopedEntry of readdirSync(join(packageRoot, packageEntry.name), { withFileTypes: true })) {
          if (scopedEntry.isDirectory()) {
            names.add(`${packageEntry.name}/${scopedEntry.name}`);
          }
        }
        continue;
      }

      names.add(packageEntry.name);
    }
  }

  return [...names].sort((left, right) => left.localeCompare(right));
}

ensureDir(nodeModulesDir);

for (const [packageName, target] of workspacePackages) {
  linkPackage(packageName, target);
}

for (const packageName of collectDependencyNames()) {
  if (workspacePackages.has(packageName)) {
    continue;
  }

  const target = resolvePnpmPackageDir(packageName);
  if (!target) {
    throw new Error(`Unable to find cached package for ${packageName}`);
  }

  linkPackage(packageName, target);
}

for (const packageName of collectCachedPackageNames()) {
  if (workspacePackages.has(packageName)) {
    continue;
  }

  const target = resolvePnpmPackageDir(packageName);
  if (!target) {
    continue;
  }

  linkPackage(packageName, target);
}
