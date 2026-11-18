/**
 * @typedef {Object} IWthekPluginManifest
 * @property {string} name - Unique identifier of the plugin.
 * @property {string} displayName - Human-friendly label for presentation in UI.
 * @property {string} description - Brief summary of what the plugin does.
 * @property {string[]} suggestedPrompts - Starter prompts suggested for UI card layouts.
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
 */
export interface IInstallOptions {
  global?: boolean;
  github?: boolean;
  dest?: string;
}

/**
 * @typedef {Object} IPostinstallResult
 * @property {boolean} installed - Whether skill files were installed.
 * @property {string[]} targets - Target directory paths where skills were placed.
 * @property {string} [reason] - Reason description if postinstall was skipped.
 */
export interface IPostinstallResult {
  installed: boolean;
  targets: string[];
  reason?: string;
}


