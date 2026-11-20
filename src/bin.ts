#!/usr/bin/env node

import * as fs from "fs";
import { installSkill } from "./installer";
import { IInstallOptions } from "./types";

/**
 * Emits message directly to controlling terminal when available, falling back to console.log.
 *
 * @param {string} text - Message text to write to terminal output.
 * @returns {void} No return value.
 */
export const outputToTerminal = (text: string): void => {
  if (process.stdout.isTTY) {
    console.log(text);
    return;
  }

  try {
    const ttyDevice = process.platform === "win32" ? "\\\\.\\CON" : "/dev/tty";
    fs.appendFileSync(ttyDevice, text + "\n");
  } catch {
    console.log(text);
  }
};

/**
 * Prints CLI usage instructions and options to standard output.
 *
 * @returns {void} No return value.
 */
export const printHelp = (): void => {
  outputToTerminal(`
@wthek/error-handling Installer
--------------------------------
Installs the WTHek Error Handling skill/plugin into your workspace or global Antigravity config.

Usage:
  npx @wthek/error-handling [command] [options]

Commands:
  install (default)   Installs the skill into target location

Options:
  --workspace, -w     Install to local workspace (.agents/skills/wthek-error-handling) [default]
  --global, -g        Install to global Antigravity config (~/.gemini/config/plugins/wthek-error-handling)
  --github            Install to GitHub workflows folder (.github/skills/wthek-error-handling)
  --dest <path>       Install to a custom directory path
  --help, -h          Display this help message

Examples:
  npx @wthek/error-handling
  npx @wthek/error-handling --global
  npx @wthek/error-handling --dest ./my-skills/wthek-error-handling
`);
};

/**
 * Parses command-line arguments and returns corresponding installation options.
 *
 * @param {string[]} args - Command line arguments passed to process.
 * @returns {IInstallOptions} Parsed installation options object.
 */
export const parseArgs = (args: string[]): IInstallOptions => {
  const isGlobal = args.includes("--global") || args.includes("-g");
  const isGithub = args.includes("--github");
  const destIndex = args.indexOf("--dest");
  let dest: string | undefined = undefined;

  if (destIndex !== -1 && args[destIndex + 1]) {
    const rawDest = args[destIndex + 1];
    if (rawDest.includes("\0") || rawDest.split(/[/\\]/).includes("..")) {
      throw new Error("Invalid destination path: directory traversal is not allowed");
    }
    dest = rawDest;
  }

  return {
    global: isGlobal,
    github: isGithub,
    dest,
  };
};

/**
 * Prints success banner with installation details, agent compatibility, and sponsorship links.
 *
 * @param {string[]} targets - Destination paths where skills were installed.
 * @returns {void} No return value.
 */
export const printSuccessBanner = (targets: string[]): void => {
  const targetLines = targets.map((t) => `     • ${t}`).join("\n");
  outputToTerminal(`
================================================================================
  WTHek Error Handling Skill Installed Successfully
================================================================================

  Provides standardized error handling, RFC 7807/9457 Problem Details,
  HTTP status codes (RFC 9110), and validation pipelines for:

  Express, Fastify, Hono, Koa, NestJS, Restify, and Model Context Protocol (MCP).

  Installation Path:
  ${targetLines}

  Supported AI Agents:
  - Antigravity  (Native plugin and skill discovery)
  - Cursor       (Workspace .agents/skills/ integration)
  - Claude Code  (Automatic skill loading)
  - GitHub Copilot (.github/skills/ and workspace skills)
  - Windsurf, Roo, Codex, and Gemini CLI

  What It Does:
  AI agents that read this skill will follow the recommended @wthek,
  http-error-kit, and http-response-status-code patterns.

  This helps maintain consistent:
  - HTTP error responses and formatting
  - HTTP status code usage
  - Validation error handling
  - Error response structures across frameworks

  Support Open Source:
  GitHub:  https://github.com/Skillnter/wthek-error-handling
  Sponsor: https://github.com/sponsors/Skillnter
  Coffee:  https://buymeacoffee.com/skillnter

  If you find this project useful, consider giving the repository a
  ⭐ on GitHub. Your support helps maintain and improve the project.

================================================================================
`);
};

/**
 * Executes CLI command workflow according to arguments.
 *
 * @returns {void} No return value.
 */
export const runCli = (): void => {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }

  const options = parseArgs(args);

  try {
    const targetDir = installSkill(options);
    printSuccessBanner([targetDir]);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Installation failed:`, message);
    process.exit(1);
  }
};

/* istanbul ignore next */
if (require.main === module) {
  runCli();
}
