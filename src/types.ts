/**
 * @typedef {Object} IWthekPluginManifest
 * @property {string} name - Unique identifier of the plugin.
 * @property {string} displayName - Human-friendly label for presentation in UI.
 * @property {string} description - Brief summary of what the plugin does.
 * @property {string[]} suggestedPrompts - Starter prompts suggested for UI card layouts.
 *
 * @example
 * ```typescript
 * import { IWthekPluginManifest } from "@wthek/error-handling";
 *
 * const manifest: IWthekPluginManifest = {
 *   name: "wthek-error-handling",
 *   displayName: "WTHek Error Handling",
 *   description: "Standardized error handling",
 *   suggestedPrompts: ["Audit error handling"],
 * };
 * ```
 */
export interface IWthekPluginManifest {
  name: string;
  displayName: string;
  description: string;
  suggestedPrompts: string[];
}

/**
 * @typedef {Object} IInstallOptions
 * @property {boolean} [global] - Whether to install into global Antigravity config directory.
 * @property {boolean} [github] - Whether to install into the workspace .github/skills directory.
 * @property {string} [dest] - Custom destination directory path for the installation.
 *
 * @example
 * ```typescript
 * import { IInstallOptions, installSkill } from "@wthek/error-handling";
 *
 * const options: IInstallOptions = {
 *   dest: "./custom/skills/wthek-error-handling",
 * };
 * installSkill(options);
 * ```
 */
export interface IInstallOptions {
  global?: boolean;
  github?: boolean;
  dest?: string;
}
