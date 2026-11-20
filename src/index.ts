import * as fs from "fs";
import {
  SOURCE_SKILL_DIR,
  SOURCE_PLUGIN_JSON,
  installSkill,
} from "./installer";
import { IWthekPluginManifest, IInstallOptions } from "./types";

export type { IWthekPluginManifest, IInstallOptions };
export { installSkill };

/**
 * Returns absolute path to bundled wthek-error-handling skill folder.
 *
 * @returns {string} Absolute path to skill directory.
 *
 * @example
 * ```typescript
 * import { getSkillPath } from "@wthek/error-handling";
 *
 * const skillDir = getSkillPath();
 * console.log(skillDir);
 * ```
 */
export const getSkillPath = (): string => {
  return SOURCE_SKILL_DIR;
};

/**
 * Returns absolute path to bundled plugin.json manifest.
 *
 * @returns {string} Absolute path to plugin manifest file.
 *
 * @example
 * ```typescript
 * import { getPluginManifestPath } from "@wthek/error-handling";
 *
 * const manifestPath = getPluginManifestPath();
 * ```
 */
export const getPluginManifestPath = (): string => {
  return SOURCE_PLUGIN_JSON;
};

/**
 * Reads and parses bundled plugin.json manifest.
 *
 * @returns {IWthekPluginManifest} Parsed plugin manifest object.
 *
 * @example
 * ```typescript
 * import { getPluginManifest } from "@wthek/error-handling";
 *
 * const manifest = getPluginManifest();
 * console.log(manifest.name, manifest.version);
 * ```
 */
export const getPluginManifest = (): IWthekPluginManifest => {
  const content = fs.readFileSync(SOURCE_PLUGIN_JSON, "utf8");
  return JSON.parse(content) as IWthekPluginManifest;
};
