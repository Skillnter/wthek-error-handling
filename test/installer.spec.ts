import * as fs from "fs";
import * as path from "path";
import * as os from "os";

jest.mock("os", () => {
  const actual = jest.requireActual("os");
  return {
    ...actual,
    homedir: jest.fn(() => actual.homedir()),
  };
});

jest.mock("fs", () => {
  const actual = jest.requireActual("fs");
  return {
    ...actual,
    readdirSync: jest.fn((...args: any[]) => (actual.readdirSync as any)(...args)),
  };
});

import {
  copyDirRecursive,
  resolveTargetDir,
  installSkill,
} from "../src/installer";

describe("installer", () => {
  const tmpDir = path.join(os.tmpdir(), "wthek-installer-test-" + Date.now());

  beforeEach(() => {
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  describe("copyDirRecursive", () => {
    it("should do nothing if source directory does not exist", () => {
      const nonExistent = path.join(tmpDir, "does-not-exist");
      const target = path.join(tmpDir, "target");
      expect(() => copyDirRecursive(nonExistent, target)).not.toThrow();
      expect(fs.existsSync(target)).toBe(false);
    });

    it("should recursively copy nested directories and files", () => {
      const src = path.join(tmpDir, "source");
      const dest = path.join(tmpDir, "dest");
      const subDir = path.join(src, "sub");
      fs.mkdirSync(subDir, { recursive: true });
      fs.writeFileSync(path.join(src, "file1.txt"), "hello", "utf8");
      fs.writeFileSync(path.join(subDir, "file2.txt"), "world", "utf8");

      copyDirRecursive(src, dest);

      expect(fs.existsSync(path.join(dest, "file1.txt"))).toBe(true);
      expect(fs.readFileSync(path.join(dest, "file1.txt"), "utf8")).toBe("hello");
      expect(fs.existsSync(path.join(dest, "sub", "file2.txt"))).toBe(true);
      expect(fs.readFileSync(path.join(dest, "sub", "file2.txt"), "utf8")).toBe("world");
    });

    it("should throw if an entry causes path traversal", () => {
      const src = path.join(tmpDir, "source-traversal");
      const dest = path.join(tmpDir, "dest-traversal");
      fs.mkdirSync(src, { recursive: true });

      const fakeDirent = {
        name: "../escaped-file",
        isDirectory: () => false,
        isFile: () => true,
      };
      (fs.readdirSync as unknown as jest.Mock).mockReturnValueOnce([fakeDirent]);

      expect(() => copyDirRecursive(src, dest)).toThrow("Path traversal detected");
    });
  });

  describe("resolveTargetDir", () => {
    it("should default to .agents/skills/wthek-error-handling in current directory", () => {
      const target = resolveTargetDir();
      expect(target).toBe(path.join(process.cwd(), ".agents", "skills", "wthek-error-handling"));
    });

    it("should resolve custom destination path when dest is provided", () => {
      const target = resolveTargetDir({ dest: "./custom-dir" });
      expect(target).toBe(path.resolve(process.cwd(), "./custom-dir"));
    });

    it("should throw error if dest contains directory traversal sequence", () => {
      expect(() => resolveTargetDir({ dest: "../traversal" })).toThrow(
        "Invalid destination path: directory traversal is not allowed"
      );
    });

    it("should throw error if dest contains null byte", () => {
      expect(() => resolveTargetDir({ dest: "bad\0dest" })).toThrow(
        "Invalid destination path: directory traversal is not allowed"
      );
    });

    it("should resolve global Antigravity config directory when global is true", () => {
      const target = resolveTargetDir({ global: true });
      expect(target).toBe(
        path.join(os.homedir(), ".gemini", "config", "plugins", "wthek-error-handling")
      );
    });

    it("should resolve .github/skills/wthek-error-handling when github is true", () => {
      const target = resolveTargetDir({ github: true });
      expect(target).toBe(path.join(process.cwd(), ".github", "skills", "wthek-error-handling"));
    });
  });

  describe("installSkill", () => {
    it("should copy skill files into custom target directory", () => {
      const targetDest = path.join(tmpDir, "custom-install");
      const result = installSkill({ dest: targetDest });

      expect(result).toBe(targetDest);
      expect(fs.existsSync(path.join(targetDest, "SKILL.md"))).toBe(true);
      expect(fs.existsSync(path.join(targetDest, "references"))).toBe(true);
    });

    it("should install skill to default workspace path when no options provided", () => {
      const cwdSpy = jest.spyOn(process, "cwd").mockReturnValue(tmpDir);
      const result = installSkill();
      expect(result).toBe(path.join(tmpDir, ".agents", "skills", "wthek-error-handling"));
      expect(fs.existsSync(path.join(result, "SKILL.md"))).toBe(true);
      cwdSpy.mockRestore();
    });

    it("should copy plugin manifest and skills when global option is selected", () => {
      (os.homedir as jest.Mock).mockReturnValue(tmpDir);

      const result = installSkill({ global: true });
      expect(result).toBe(
        path.join(tmpDir, ".gemini", "config", "plugins", "wthek-error-handling")
      );
      expect(fs.existsSync(path.join(result, "plugin.json"))).toBe(true);
      expect(fs.existsSync(path.join(result, "skills", "wthek-error-handling", "SKILL.md"))).toBe(
        true
      );

      (os.homedir as jest.Mock).mockReset();
    });
  });
});

