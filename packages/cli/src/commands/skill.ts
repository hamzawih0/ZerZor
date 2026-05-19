import { Command } from "commander";
import { log, printText } from "../output.js";
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "fs";
import { join, dirname, resolve } from "path";
import { homedir } from "os";
import { fileURLToPath } from "url";

interface Platform {
  id: string;
  name: string;
  dir: string;
  skillPath: string;
}

function getRuntimeEnv(name: string): string | undefined {
  const proc = Reflect.get(globalThis, "process") as
    | { env?: Record<string, string | undefined> }
    | undefined;
  return proc?.env?.[name];
}

function getPlatforms(): Platform[] {
  const home = homedir();
  const codexHome = getRuntimeEnv("CODEX_HOME") || join(home, ".codex");
  return [
    {
      id: "claude",
      name: "Claude Code",
      dir: join(home, ".claude"),
      skillPath: join(home, ".claude", "skills", "ZorMail", "SKILL.md"),
    },
    {
      id: "codex",
      name: "Codex",
      dir: codexHome,
      skillPath: join(codexHome, "skills", "ZorMail", "SKILL.md"),
    },
  ];
}

function getSkillSource(): string {
  // Resolve skill file relative to the executing script
  // Bundled: dist/index.js → ../skill/SKILL.md
  // Source:  src/commands/skill.ts → ../../skill/SKILL.md
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    join(scriptDir, "..", "skill", "SKILL.md"),       // from dist/
    join(scriptDir, "..", "..", "skill", "SKILL.md"),  // from src/commands/
  ];
  for (const p of candidates) {
    const resolved = resolve(p);
    if (existsSync(resolved)) {
      return readFileSync(resolved, "utf-8");
    }
  }
  throw new Error("SKILL.md not found");
}

function installTo(platform: Platform, content: string): boolean {
  try {
    mkdirSync(dirname(platform.skillPath), { recursive: true });
    writeFileSync(platform.skillPath, content, "utf-8");
    return true;
  } catch (e: any) {
    log(`Error installing to ${platform.name}: ${e.message}`);
    return false;
  }
}

export function registerSkillCommand(program: Command) {
  const skill = program
    .command("skill")
    .description("Manage ZorMail AI agent skill");

  skill
    .command("install")
    .description("Install ZorMail skill to AI agent platforms")
    .option(
      "--platform <platform>",
      "target platform: claude, codex, all (default: auto-detect)"
    )
    .action((opts) => {
      let content: string;
      try {
        content = getSkillSource();
      } catch {
        log("Error: Could not read skill file from package.");
        process.exit(1);
      }

      const platforms = getPlatforms();
      const platformFlag = opts.platform?.toLowerCase();

      let targets: Platform[];

      if (platformFlag === "all") {
        targets = platforms;
      } else if (platformFlag) {
        const match = platforms.find((p) => p.id === platformFlag);
        if (!match) {
          log(
            `Error: Unknown platform "${opts.platform}". Supported: claude, codex, all`
          );
          process.exit(1);
        }
        targets = [match];
      } else {
        // Auto-detect: only platforms whose base dir exists
        targets = platforms.filter((p) => existsSync(p.dir));
        if (targets.length === 0) {
          log(
            "No supported agent platform detected. Use --platform to specify manually."
          );
          log("Supported: claude, codex, all");
          process.exit(1);
        }
      }

      let installed = 0;
      let failed = 0;
      for (const t of targets) {
        if (installTo(t, content)) {
          printText(`Installed skill to ${t.name} (${t.skillPath})`);
          installed++;
        } else {
          failed++;
        }
      }

      if (installed === 0 || failed > 0) {
        process.exit(1);
      }
    });
}


