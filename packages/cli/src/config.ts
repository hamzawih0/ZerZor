import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

export interface CliConfig {
  apiUrl: string;
  apiKey: string;
}

const CONFIG_DIR = join(homedir(), ".zormail");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

export function loadConfig(): CliConfig {
  const config: CliConfig = { apiUrl: "https://zormail.app", apiKey: "" };

  // File config
  if (existsSync(CONFIG_FILE)) {
    try {
      const raw = JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
      if (raw.apiUrl) config.apiUrl = raw.apiUrl;
      if (raw.apiKey) config.apiKey = raw.apiKey;
    } catch {}
  }

  // Env overrides (higher priority)
  if (process.env.ZORMAIL_API_URL) config.apiUrl = process.env.ZORMAIL_API_URL;
  if (process.env.ZORMAIL_API_KEY) config.apiKey = process.env.ZORMAIL_API_KEY;

  return config;
}

export function saveConfig(key: string, value: string): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }

  let config: Record<string, string> = {};
  if (existsSync(CONFIG_FILE)) {
    try {
      config = JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
    } catch {}
  }

  const keyMap: Record<string, string> = {
    "api-url": "apiUrl",
    "api-key": "apiKey",
  };

  const configKey = keyMap[key];
  if (!configKey) {
    throw new Error(`Unknown config key: ${key}. Valid keys: api-url, api-key`);
  }

  config[configKey] = value;
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

