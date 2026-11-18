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

import {
  copyDirRecursive,
  resolveTargetDir,
  installSkill,
  handlePostinstall,
  PKG_ROOT,
  SOURCE_SKILL_DIR,
  SOURCE_PLUGIN_JSON,
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

  describe("handlePostinstall", () => {
    const originalEnv = process.env.INIT_CWD;

    afterEach(() => {
      process.env.INIT_CWD = originalEnv;
    });

    it("should return installed false if INIT_CWD is not defined", () => {
      delete process.env.INIT_CWD;
      const res = handlePostinstall();
      expect(res.installed).toBe(false);
      expect(res.targets).toHaveLength(0);
      expect(res.reason).toContain("INIT_CWD");
    });

    it("should return installed false if INIT_CWD is the package root directory", () => {
      process.env.INIT_CWD = PKG_ROOT;
      const res = handlePostinstall();
      expect(res.installed).toBe(false);
      expect(res.targets).toHaveLength(0);
      expect(res.reason).toContain("In-repo");
    });

    it("should install skill to INIT_CWD/.agents/skills when run in external consumer project", () => {
      const mockProjectDir = path.join(tmpDir, "consumer-app");
      fs.mkdirSync(mockProjectDir, { recursive: true });
      process.env.INIT_CWD = mockProjectDir;

      const res = handlePostinstall();
      expect(res.installed).toBe(true);
      expect(res.targets).toHaveLength(1);
      expect(
        fs.existsSync(
          path.join(mockProjectDir, ".agents", "skills", "wthek-error-handling", "SKILL.md")
        )
      ).toBe(true);
    });

    it("should also install to .github/skills if .github folder exists in consumer project", () => {
      const mockProjectDir = path.join(tmpDir, "consumer-github-app");
      fs.mkdirSync(path.join(mockProjectDir, ".github"), { recursive: true });
      process.env.INIT_CWD = mockProjectDir;

      const res = handlePostinstall();
      expect(res.installed).toBe(true);
      expect(res.targets).toHaveLength(2);
      expect(
        fs.existsSync(
          path.join(mockProjectDir, ".github", "skills", "wthek-error-handling", "SKILL.md")
        )
      ).toBe(true);
    });

    it("should accept explicit targetRoot override parameter", () => {
      const mockProjectDir = path.join(tmpDir, "consumer-param-app");
      fs.mkdirSync(mockProjectDir, { recursive: true });

      const res = handlePostinstall(mockProjectDir);
      expect(res.installed).toBe(true);
      expect(res.targets).toHaveLength(1);
      expect(
        fs.existsSync(
          path.join(mockProjectDir, ".agents", "skills", "wthek-error-handling", "SKILL.md")
        )
      ).toBe(true);
    });
  });
});

