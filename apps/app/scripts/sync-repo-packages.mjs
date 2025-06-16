// This is a workaround to avoid build issues, because for Electron all packages must be in the same directory, and the package is just a symlink. So we are running this script to copy the package to the app's node_modules. If you know a better way to do this, please create a PR to fix this 🙏
import { cpSync, existsSync, lstatSync, mkdirSync, rmSync } from "node:fs";
import * as path from "node:path";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, "..", "..", "..");
const appDir = join(repoRoot, "apps", "app");

// List the packages you want to copy from the monorepo's packages directory
const packagesToCopy = ["api-types"];

for (const pkg of packagesToCopy) {
  const srcDir = join(repoRoot, "packages", pkg);
  if (!existsSync(srcDir)) {
    console.error(`✗ sync-repo-packages: could not locate packages/${pkg}`);
    process.exit(1);
  }

  const dstDir = join(appDir, "node_modules", "@repo", pkg);

  try {
    if (existsSync(dstDir)) {
      const isLink = lstatSync(dstDir).isSymbolicLink();
      rmSync(dstDir, { recursive: true, force: true });
      if (!isLink) {
        console.log(`ℹ︎ fix-${pkg}: pre-existing folder removed`);
      }
    } else {
      mkdirSync(dirname(dstDir), { recursive: true });
    }

    cpSync(srcDir, dstDir, {
      recursive: true,
      dereference: true,
      filter: (src) => !src.includes(`${path.sep}node_modules${path.sep}`),
    });
    console.log(
      `✓ ${pkg} copied ${relative(repoRoot, srcDir)} → ${relative(
        repoRoot,
        dstDir
      )}`
    );
  } catch (e) {
    console.error(`✗ fix-${pkg} failed:`, e);
    process.exit(1);
  }
}
