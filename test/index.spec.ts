import * as fs from "fs";
import {
  getSkillPath,
  getPluginManifestPath,
  getPluginManifest,
  installSkill,
  handlePostinstall,
} from "../src/index";

describe("index exports", () => {
  it("should return the absolute path to the skill directory", () => {
    const skillPath = getSkillPath();
    expect(fs.existsSync(skillPath)).toBe(true);
    expect(fs.existsSync(`${skillPath}/SKILL.md`)).toBe(true);
  });

  it("should return the absolute path to the plugin.json manifest", () => {
    const manifestPath = getPluginManifestPath();
    expect(fs.existsSync(manifestPath)).toBe(true);
  });

  it("should parse and return the valid plugin manifest object", () => {
    const manifest = getPluginManifest();
    expect(manifest).toBeDefined();
    expect(manifest.name).toBe("wthek-error-handling");
    expect(manifest.displayName).toBe("WTHek Error Handling");
    expect(typeof manifest.description).toBe("string");
    expect(Array.isArray(manifest.suggestedPrompts)).toBe(true);
    expect(manifest.suggestedPrompts.length).toBeGreaterThan(0);
  });

  it("should export installSkill and handlePostinstall functions", () => {
    expect(typeof installSkill).toBe("function");
    expect(typeof handlePostinstall).toBe("function");
  });
});

