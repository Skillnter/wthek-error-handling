import * as fs from "fs";
import {
  SOURCE_SKILL_DIR,
  SOURCE_PLUGIN_JSON,
  installSkill,
  handlePostinstall,
} from "./installer";
import { IWthekPluginManifest, IInstallOptions, IPostinstallResult } from "./types";

export type { IWthekPluginManifest, IInstallOptions, IPostinstallResult };
export { installSkill, handlePostinstall };

/**
 * Returns absolute path to bundled wthek-error-handling skill folder.
 *
 * @returns {string} Absolute path to skill directory.
 */
export const getSkillPath = (): string => {
  return SOURCE_SKILL_DIR;
};

/**
 * Returns absolute path to bundled plugin.json manifest.
 *
 * @returns {string} Absolute path to plugin manifest file.
 */
export const getPluginManifestPath = (): string => {
  return SOURCE_PLUGIN_JSON;
};

/**
 * Reads and parses bundled plugin.json manifest.
 *
 * @returns {IWthekPluginManifest} Parsed plugin manifest object.
 */
export const getPluginManifest = (): IWthekPluginManifest => {
  const content = fs.readFileSync(SOURCE_PLUGIN_JSON, "utf8");
  return JSON.parse(content) as IWthekPluginManifest;
};
