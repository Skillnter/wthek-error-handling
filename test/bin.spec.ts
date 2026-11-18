import * as fs from "fs";

jest.mock("fs", () => {
  const actual = jest.requireActual("fs");
  return {
    ...actual,
    appendFileSync: jest.fn(),
  };
});

import { parseArgs, printHelp, runCli, outputToTerminal } from "../src/bin";
import * as installer from "../src/installer";

describe("bin / CLI helpers", () => {
  describe("parseArgs", () => {
    it("should parse default flags", () => {
      const opts = parseArgs([]);
      expect(opts.global).toBe(false);
      expect(opts.github).toBe(false);
      expect(opts.dest).toBeUndefined();
    });

    it("should parse --global and -g", () => {
      expect(parseArgs(["--global"]).global).toBe(true);
      expect(parseArgs(["-g"]).global).toBe(true);
    });

    it("should parse --github", () => {
      expect(parseArgs(["--github"]).github).toBe(true);
    });

    it("should parse --dest flag with path argument", () => {
      const opts = parseArgs(["--dest", "./my-folder"]);
      expect(opts.dest).toBe("./my-folder");
    });
  });

  describe("printHelp", () => {
    it("should print help text to console without error", () => {
      Object.defineProperty(process.stdout, "isTTY", { value: true, configurable: true });
      const spy = jest.spyOn(console, "log").mockImplementation(() => {});
      printHelp();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe("outputToTerminal", () => {
    const originalIsTTY = process.stdout.isTTY;
    const originalPlatform = process.platform;

    afterEach(() => {
      Object.defineProperty(process.stdout, "isTTY", {
        value: originalIsTTY,
        configurable: true,
      });
      Object.defineProperty(process, "platform", {
        value: originalPlatform,
        configurable: true,
      });
      jest.restoreAllMocks();
    });

    it("should write to console.log when stdout is an interactive TTY", () => {
      Object.defineProperty(process.stdout, "isTTY", { value: true, configurable: true });
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      outputToTerminal("terminal hello");
      expect(logSpy).toHaveBeenCalledWith("terminal hello");
    });

    it("should write to /dev/tty when stdout is not TTY on non-win32 platforms", () => {
      Object.defineProperty(process.stdout, "isTTY", { value: false, configurable: true });
      Object.defineProperty(process, "platform", { value: "darwin", configurable: true });
      (fs.appendFileSync as jest.Mock).mockReset();

      outputToTerminal("tty message");
      expect(fs.appendFileSync).toHaveBeenCalledWith("/dev/tty", "tty message\n");
    });

    it("should write to CON device when on win32 platform and not TTY", () => {
      Object.defineProperty(process.stdout, "isTTY", { value: false, configurable: true });
      Object.defineProperty(process, "platform", { value: "win32", configurable: true });
      (fs.appendFileSync as jest.Mock).mockReset();

      outputToTerminal("win32 message");
      expect(fs.appendFileSync).toHaveBeenCalledWith("\\\\.\\CON", "win32 message\n");
    });

    it("should fallback to console.log if writing to tty device throws", () => {
      Object.defineProperty(process.stdout, "isTTY", { value: false, configurable: true });
      (fs.appendFileSync as jest.Mock).mockImplementationOnce(() => {
        throw new Error("ENXIO: no such device or address");
      });
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

      outputToTerminal("fallback message");
      expect(logSpy).toHaveBeenCalledWith("fallback message");
    });
  });

  describe("runCli", () => {
    const originalArgv = process.argv;
    const originalIsTTY = process.stdout.isTTY;

    beforeEach(() => {
      Object.defineProperty(process.stdout, "isTTY", { value: true, configurable: true });
    });

    afterEach(() => {
      process.argv = originalArgv;
      Object.defineProperty(process.stdout, "isTTY", {
        value: originalIsTTY,
        configurable: true,
      });
      jest.restoreAllMocks();
    });

    it("should display help when --help flag is passed", () => {
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      process.argv = ["node", "bin.js", "--help"];
      runCli();
      expect(logSpy).toHaveBeenCalled();
    });

    it("should print success banner when --postinstall installs files", () => {
      const postinstallSpy = jest
        .spyOn(installer, "handlePostinstall")
        .mockReturnValue({
          installed: true,
          targets: ["/mock/project/.agents/skills/wthek-error-handling"],
        });
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      process.argv = ["node", "bin.js", "--postinstall"];
      runCli();
      expect(postinstallSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("WTHek Error Handling Skill Installed Successfully")
      );
    });

    it("should print notice when --postinstall skips with reason", () => {
      const postinstallSpy = jest
        .spyOn(installer, "handlePostinstall")
        .mockReturnValue({
          installed: false,
          targets: [],
          reason: "In-repo package development detected",
        });
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      process.argv = ["node", "bin.js", "--postinstall"];
      runCli();
      expect(postinstallSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Postinstall notice: In-repo package development detected")
      );
    });

    it("should print notice with fallback message when --postinstall skips without reason", () => {
      const postinstallSpy = jest
        .spyOn(installer, "handlePostinstall")
        .mockReturnValue({
          installed: false,
          targets: [],
        });
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      process.argv = ["node", "bin.js", "--postinstall"];
      runCli();
      expect(postinstallSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Postinstall notice: Skipped installation.")
      );
    });

    it("should call installSkill and log success on normal execution", () => {
      const installSpy = jest
        .spyOn(installer, "installSkill")
        .mockReturnValue("/mock/target");
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      process.argv = ["node", "bin.js"];
      runCli();
      expect(installSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("WTHek Error Handling Skill Installed Successfully")
      );
    });

    it("should log error and exit when installSkill throws an error", () => {
      jest.spyOn(installer, "installSkill").mockImplementation(() => {
        throw new Error("Disk full");
      });
      const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      const exitSpy = jest
        .spyOn(process, "exit")
        .mockImplementation((() => {}) as (code?: string | number | null | undefined) => never);

      process.argv = ["node", "bin.js"];
      runCli();

      expect(errorSpy).toHaveBeenCalledWith("❌ Installation failed:", "Disk full");
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it("should log non-Error message when installSkill throws a primitive string", () => {
      jest.spyOn(installer, "installSkill").mockImplementation(() => {
        throw "Disk full string failure";
      });
      const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      const exitSpy = jest
        .spyOn(process, "exit")
        .mockImplementation((() => {}) as (code?: string | number | null | undefined) => never);

      process.argv = ["node", "bin.js"];
      runCli();

      expect(errorSpy).toHaveBeenCalledWith(
        "❌ Installation failed:",
        "Disk full string failure"
      );
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });
});

