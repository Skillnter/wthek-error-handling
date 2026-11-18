import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { IInstallOptions } from "./types";

/**
 * Path to package root directory.
 */
export const PKG_ROOT: string = path.resolve(__dirname, "..");

/**
 * Path to source skill directory inside package.
 */
export const SOURCE_SKILL_DIR: string = path.join(
  PKG_ROOT,
  "skills",
  "wthek-error-handling"
);

/**
 * Path to plugin.json manifest inside package.
 */
export const SOURCE_PLUGIN_JSON: string = path.join(PKG_ROOT, "plugin.json");

/**
 * Recursively copies a directory and its contents from source to destination.
 *
 * @param {string} src - Source directory path to copy from.
 * @param {string} dest - Destination directory path to copy into.
 * @returns {void} No return value.
 */
export const copyDirRecursive = (src: string, dest: string): void => {
  if (!fs.existsSync(src)) {
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

/**
 * Resolves destination directory for installation based on provided options.
 *
 * @param {IInstallOptions} [options] - Configuration options determining installation target.
 * @returns {string} Absolute path to resolved target installation directory.
 */
export const resolveTargetDir = (options?: IInstallOptions): string => {
  if (options?.dest) {
    return path.resolve(process.cwd(), options.dest);
  }
  if (options?.global) {
    return path.join(
      os.homedir(),
      ".gemini",
      "config",
      "plugins",
      "wthek-error-handling"
    );
  }
  if (options?.github) {
    return path.join(process.cwd(), ".github", "skills", "wthek-error-handling");
  }
  return path.join(process.cwd(), ".agents", "skills", "wthek-error-handling");
};

/**
 * Installs skill files and plugin manifest to target directory.
 *
 * @param {IInstallOptions} [options] - Optional settings controlling target directory location.
 * @returns {string} Absolute path where skill files were installed.
 */
export const installSkill = (options?: IInstallOptions): string => {
  const targetDir = resolveTargetDir(options);

  if (options?.global) {
    fs.mkdirSync(targetDir, { recursive: true });
    if (fs.existsSync(SOURCE_PLUGIN_JSON)) {
      fs.copyFileSync(SOURCE_PLUGIN_JSON, path.join(targetDir, "plugin.json"));
    }
    const pluginSkillDir = path.join(targetDir, "skills", "wthek-error-handling");
    copyDirRecursive(SOURCE_SKILL_DIR, pluginSkillDir);
  } else {
    copyDirRecursive(SOURCE_SKILL_DIR, targetDir);
  }

  return targetDir;
};
