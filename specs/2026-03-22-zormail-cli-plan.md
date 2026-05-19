# ZorMail CLI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an agent-first CLI tool that wraps ZorMail's existing REST API, published as an npm package.

**Architecture:** CLI lives in `packages/cli/`, uses commander for arg parsing, calls ZorMail API via `fetch` with `X-API-Key` auth. One server-side fix needed for the send endpoint auth.

**Tech Stack:** TypeScript, Bun (build), commander (CLI framework), Node built-in `fetch` and `fs`

**Spec:** `specs/2026-03-22-zormail-cli-design.md`

---

## File Structure

```
packages/cli/
├── src/
│   ├── index.ts          # Entry point — program definition, command registration
│   ├── commands/
│   │   ├── config.ts     # config set/list subcommands
│   │   ├── create.ts     # create temp email
│   │   ├── list.ts       # list mailboxes or messages
│   │   ├── wait.ts       # poll for new messages
│   │   ├── read.ts       # read message content
│   │   ├── send.ts       # send email
│   │   └── delete.ts     # delete mailbox or message
│   ├── api.ts            # HTTP client — all API calls, error handling, auth header
│   ├── config.ts         # Config file read/write (~/.zormail/config.json) + env override
│   └── output.ts         # Output helpers — json/text formatting, stderr logging
├── package.json
├── tsconfig.json
└── README.md
```

**Server-side change:**
- Modify: `app/api/emails/[id]/send/route.ts` — switch from `auth()` to `getUserId()`

**Agent discoverability:**
- Create: `public/llms.txt`

**CI/CD:**
- Create: `.github/workflows/publish-cli.yml`

---

### Task 1: Project Scaffolding

**Files:**
- Create: `packages/cli/package.json`
- Create: `packages/cli/tsconfig.json`
- Create: `packages/cli/src/index.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "zormail-cli",
  "version": "0.1.0",
  "description": "Agent-first CLI for ZorMail temporary email service",
  "type": "module",
  "bin": {
    "zormail": "dist/index.js"
  },
  "scripts": {
    "build": "bun build ./src/index.ts --outdir ./dist --target=node",
    "dev": "bun run ./src/index.ts"
  },
  "files": ["dist"],
  "keywords": ["email", "temporary", "cli", "agent", "ai"],
  "license": "MIT",
  "dependencies": {
    "commander": "^12.0.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create minimal entry point**

`packages/cli/src/index.ts`:
```ts
#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program
  .name("zormail")
  .description("ZorMail CLI — Agent-friendly temporary email tool")
  .version("0.1.0");

program.parse();
```

- [ ] **Step 4: Install dependencies and verify**

```bash
cd packages/cli && pnpm install
bun run src/index.ts --help
```

Expected: commander help output with program name and version.

- [ ] **Step 5: Verify build**

```bash
cd packages/cli && bun build ./src/index.ts --outdir ./dist --target=node
node dist/index.js --help
```

Expected: same help output.

- [ ] **Step 6: Commit**

```bash
git add packages/cli/
git commit -m "feat(cli): scaffold CLI package with commander"
```

---

### Task 2: Config Module

**Files:**
- Create: `packages/cli/src/config.ts`
- Create: `packages/cli/src/commands/config.ts`

- [ ] **Step 1: Implement config read/write module**

`packages/cli/src/config.ts`:
```ts
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
  const config: CliConfig = { apiUrl: "", apiKey: "" };

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

  // Map CLI key names to config keys
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
```

- [ ] **Step 2: Implement config command**

`packages/cli/src/commands/config.ts`:
```ts
import { Command } from "commander";
import { loadConfig, saveConfig } from "../config.js";

export function registerConfigCommand(program: Command) {
  const cmd = program.command("config").description("Configure API endpoint and API Key");

  cmd
    .command("set <key> <value>")
    .description("Set a config value (api-url or api-key)")
    .action((key: string, value: string) => {
      try {
        saveConfig(key, value);
        console.error(`Set ${key} successfully.`);
      } catch (e: any) {
        console.error(e.message);
        process.exit(1);
      }
    });

  cmd
    .command("list")
    .description("Show current configuration")
    .action(() => {
      const config = loadConfig();
      console.log(`api-url: ${config.apiUrl || "(not set)"}`);
      console.log(`api-key: ${config.apiKey ? config.apiKey.slice(0, 6) + "..." : "(not set)"}`);
    });
}
```

- [ ] **Step 3: Register in index.ts**

Update `packages/cli/src/index.ts` to import and register:
```ts
#!/usr/bin/env node
import { Command } from "commander";
import { registerConfigCommand } from "./commands/config.js";

const program = new Command();

program
  .name("zormail")
  .description("ZorMail CLI — Agent-friendly temporary email tool")
  .version("0.1.0")
  .option("--json", "output as JSON");

registerConfigCommand(program);

program.parse();
```

- [ ] **Step 4: Test manually**

```bash
cd packages/cli
bun run src/index.ts config set api-url https://zormail.app
bun run src/index.ts config set api-key mk_test123
bun run src/index.ts config list
cat ~/.zormail/config.json
```

Expected: config values saved and displayed correctly.

- [ ] **Step 5: Commit**

```bash
git add packages/cli/
git commit -m "feat(cli): add config module and config command"
```

---

### Task 3: Output Module

**Files:**
- Create: `packages/cli/src/output.ts`

- [ ] **Step 1: Implement output helpers**

`packages/cli/src/output.ts`:
```ts
/**
 * Print JSON to stdout (for --json mode).
 */
export function printJson(data: unknown): void {
  console.log(JSON.stringify(data));
}

/**
 * Print human-readable text to stdout.
 */
export function printText(text: string): void {
  console.log(text);
}

/**
 * Log to stderr (progress, errors — never pollutes stdout).
 */
export function log(message: string): void {
  console.error(message);
}

/**
 * Convert epoch ms timestamp to ISO 8601 string.
 */
export function msToIso(ms: number): string {
  return new Date(ms).toISOString();
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/cli/src/output.ts
git commit -m "feat(cli): add output formatting helpers"
```

---

### Task 4: API Client

**Files:**
- Create: `packages/cli/src/api.ts`

- [ ] **Step 1: Implement API client**

`packages/cli/src/api.ts`:
```ts
import { loadConfig } from "./config.js";
import { log } from "./output.js";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request(
  method: string,
  path: string,
  body?: Record<string, unknown>,
): Promise<unknown> {
  const config = loadConfig();

  if (!config.apiUrl) {
    log("Error: API URL not configured. Run: zormail config set api-url <url>");
    process.exit(2);
  }
  if (!config.apiKey) {
    log("Error: API Key not configured. Run: zormail config set api-key <key>");
    process.exit(2);
  }

  const url = `${config.apiUrl.replace(/\/$/, "")}${path}`;
  const headers: Record<string, string> = {
    "X-API-Key": config.apiKey,
  };
  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 || res.status === 403) {
    log("Error: Authentication failed. Check your API Key.");
    process.exit(2);
  }

  if (res.status === 204) {
    return null;
  }

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(res.status, (data as any).error || `HTTP ${res.status}`);
  }

  return data;
}

export const api = {
  getConfig: () => request("GET", "/api/config"),

  createEmail: (body: { name?: string; expiryTime: number; domain: string }) =>
    request("POST", "/api/emails/generate", body as any),

  listEmails: (cursor?: string) =>
    request("GET", `/api/emails${cursor ? `?cursor=${cursor}` : ""}`),

  listMessages: (emailId: string, cursor?: string) =>
    request("GET", `/api/emails/${emailId}${cursor ? `?cursor=${cursor}` : ""}`),

  getMessage: (emailId: string, messageId: string) =>
    request("GET", `/api/emails/${emailId}/${messageId}`),

  deleteEmail: (emailId: string) =>
    request("DELETE", `/api/emails/${emailId}`),

  deleteMessage: (emailId: string, messageId: string) =>
    request("DELETE", `/api/emails/${emailId}/${messageId}`),

  sendEmail: (emailId: string, body: { to: string; subject: string; content: string }) =>
    request("POST", `/api/emails/${emailId}/send`, body),
};
```

- [ ] **Step 2: Commit**

```bash
git add packages/cli/src/api.ts
git commit -m "feat(cli): add API client module"
```

---

### Task 5: Create Command

**Files:**
- Create: `packages/cli/src/commands/create.ts`
- Modify: `packages/cli/src/index.ts`

- [ ] **Step 1: Implement create command**

`packages/cli/src/commands/create.ts`:
```ts
import { Command } from "commander";
import { api } from "../api.js";
import { log, printJson, printText, msToIso } from "../output.js";

const EXPIRY_MAP: Record<string, number> = {
  "1h": 3600000,
  "24h": 86400000,
  "3d": 259200000,
  permanent: 0,
};

export function registerCreateCommand(program: Command) {
  program
    .command("create")
    .description("Create a temporary email address")
    .option("--name <name>", "email prefix")
    .option("--domain <domain>", "email domain")
    .option("--expiry <expiry>", "1h | 24h | 3d | permanent", "1h")
    .action(async (opts) => {
      const json = program.opts().json;
      const expiryTime = EXPIRY_MAP[opts.expiry];
      if (expiryTime === undefined) {
        log(`Error: Invalid expiry "${opts.expiry}". Valid: 1h, 24h, 3d, permanent`);
        process.exit(1);
      }

      try {
        // If no domain specified, fetch from server config
        let domain = opts.domain;
        if (!domain) {
          const config = (await api.getConfig()) as any;
          const domains = config.emailDomains?.split(",").map((d: string) => d.trim());
          if (!domains?.length) {
            log("Error: No email domains configured on server.");
            process.exit(1);
          }
          domain = domains[0];
        }

        const result = (await api.createEmail({
          name: opts.name,
          expiryTime,
          domain,
        })) as any;

        const expiresAt =
          expiryTime === 0
            ? null
            : msToIso(Date.now() + expiryTime);

        if (json) {
          printJson({
            id: result.id,
            address: result.email,
            expiresAt,
          });
        } else {
          const expiryLabel = opts.expiry === "permanent" ? "permanent" : `expires in ${opts.expiry}`;
          printText(`Created: ${result.email} (${expiryLabel})`);
          printText(`ID: ${result.id}`);
        }
      } catch (e: any) {
        log(`Error: ${e.message}`);
        process.exit(1);
      }
    });
}
```

- [ ] **Step 2: Register in index.ts**

Add import and call `registerCreateCommand(program)` before `program.parse()`.

- [ ] **Step 3: Test manually**

```bash
cd packages/cli
bun run src/index.ts create --help
bun run src/index.ts create --domain zormail.app --expiry 1h --json
```

- [ ] **Step 4: Commit**

```bash
git add packages/cli/
git commit -m "feat(cli): add create command"
```

---

### Task 6: List Command

**Files:**
- Create: `packages/cli/src/commands/list.ts`
- Modify: `packages/cli/src/index.ts`

- [ ] **Step 1: Implement list command**

`packages/cli/src/commands/list.ts`:
```ts
import { Command } from "commander";
import { api } from "../api.js";
import { log, printJson, printText, msToIso } from "../output.js";

export function registerListCommand(program: Command) {
  program
    .command("list")
    .description("List mailboxes or messages")
    .option("--email-id <id>", "list messages in this mailbox")
    .option("--cursor <cursor>", "pagination cursor")
    .action(async (opts) => {
      const json = program.opts().json;
      try {
        if (opts.emailId) {
          // List messages
          const data = (await api.listMessages(opts.emailId, opts.cursor)) as any;
          if (json) {
            printJson({
              messages: data.messages.map((m: any) => ({
                id: m.id,
                from: m.from_address,
                subject: m.subject,
                receivedAt: m.received_at ? msToIso(m.received_at) : null,
              })),
              nextCursor: data.nextCursor,
              total: data.total,
            });
          } else {
            if (!data.messages.length) {
              printText("No messages.");
            } else {
              for (const m of data.messages) {
                printText(`[${m.id}] From: ${m.from_address} — ${m.subject}`);
              }
              printText(`Total: ${data.total}`);
            }
          }
        } else {
          // List mailboxes
          // Note: GET /api/emails returns raw Drizzle ORM objects.
          // expiresAt is a Date serialized to ISO string (not epoch ms).
          const data = (await api.listEmails(opts.cursor)) as any;
          if (json) {
            printJson({
              emails: data.emails.map((e: any) => ({
                id: e.id,
                address: e.address,
                expiresAt: e.expiresAt || null,  // Already ISO string from server
              })),
              nextCursor: data.nextCursor,
              total: data.total,
            });
          } else {
            if (!data.emails.length) {
              printText("No mailboxes.");
            } else {
              for (const e of data.emails) {
                printText(`[${e.id}] ${e.address}`);
              }
              printText(`Total: ${data.total}`);
            }
          }
        }
      } catch (e: any) {
        log(`Error: ${e.message}`);
        process.exit(1);
      }
    });
}
```

- [ ] **Step 2: Register in index.ts and test**

```bash
bun run src/index.ts list --json
bun run src/index.ts list --email-id <id-from-create> --json
```

- [ ] **Step 3: Commit**

```bash
git add packages/cli/
git commit -m "feat(cli): add list command for mailboxes and messages"
```

---

### Task 7: Wait Command

**Files:**
- Create: `packages/cli/src/commands/wait.ts`
- Modify: `packages/cli/src/index.ts`

- [ ] **Step 1: Implement wait command**

`packages/cli/src/commands/wait.ts`:
```ts
import { Command } from "commander";
import { api } from "../api.js";
import { log, printJson, printText, msToIso } from "../output.js";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function registerWaitCommand(program: Command) {
  program
    .command("wait")
    .description("Wait for a new email to arrive")
    .requiredOption("--email-id <id>", "email ID to watch")
    .option("--timeout <seconds>", "max wait time in seconds", "120")
    .option("--interval <seconds>", "poll interval in seconds", "5")
    .action(async (opts) => {
      const json = program.opts().json;
      const timeout = parseInt(opts.timeout, 10);
      const interval = parseInt(opts.interval, 10);
      const emailId = opts.emailId;

      try {
        // Record initial message IDs
        const initial = (await api.listMessages(emailId)) as any;
        const knownIds = new Set<string>(initial.messages.map((m: any) => m.id));

        const startTime = Date.now();

        while (true) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          if (elapsed >= timeout) {
            log(`Timeout: no new messages received within ${timeout}s`);
            process.exit(1);
          }

          log(`Polling... (${elapsed}/${timeout}s)`);
          await sleep(interval * 1000);

          const current = (await api.listMessages(emailId)) as any;
          const newMessages = current.messages.filter((m: any) => !knownIds.has(m.id));

          if (newMessages.length > 0) {
            const msg = newMessages[0];
            if (json) {
              printJson({
                messageId: msg.id,
                from: msg.from_address,
                subject: msg.subject,
                receivedAt: msg.received_at ? msToIso(msg.received_at) : null,
              });
            } else {
              printText(`New message from ${msg.from_address}: "${msg.subject}"`);
              printText(`Message ID: ${msg.id}`);
            }
            return;
          }
        }
      } catch (e: any) {
        log(`Error: ${e.message}`);
        process.exit(1);
      }
    });
}
```

- [ ] **Step 2: Register in index.ts**

- [ ] **Step 3: Test manually**

```bash
# In one terminal, create an email and wait
bun run src/index.ts wait --email-id <id> --timeout 30 --interval 3 --json
# Send a test email to it from another source to verify detection
```

- [ ] **Step 4: Commit**

```bash
git add packages/cli/
git commit -m "feat(cli): add wait command with client-side polling"
```

---

### Task 8: Read Command

**Files:**
- Create: `packages/cli/src/commands/read.ts`
- Modify: `packages/cli/src/index.ts`

- [ ] **Step 1: Implement read command**

`packages/cli/src/commands/read.ts`:
```ts
import { Command } from "commander";
import { api } from "../api.js";
import { log, printJson, printText, msToIso } from "../output.js";

export function registerReadCommand(program: Command) {
  program
    .command("read")
    .description("Read an email message")
    .requiredOption("--email-id <id>", "email ID")
    .requiredOption("--message-id <id>", "message ID")
    .option("--format <format>", "text | html", "text")
    .action(async (opts) => {
      const json = program.opts().json;
      try {
        const data = (await api.getMessage(opts.emailId, opts.messageId)) as any;
        const msg = data.message;

        if (json) {
          printJson({
            id: msg.id,
            from: msg.from_address,
            to: msg.to_address,
            subject: msg.subject,
            content: msg.content,
            html: msg.html,
            receivedAt: msg.received_at ? msToIso(msg.received_at) : null,
            type: msg.type,
          });
        } else {
          printText(`From: ${msg.from_address}`);
          printText(`To: ${msg.to_address}`);
          printText(`Subject: ${msg.subject}`);
          printText(`---`);
          if (opts.format === "html") {
            printText(msg.html || "(no HTML content)");
          } else {
            printText(msg.content || "(no text content)");
          }
        }
      } catch (e: any) {
        log(`Error: ${e.message}`);
        process.exit(1);
      }
    });
}
```

- [ ] **Step 2: Register in index.ts and test**

```bash
bun run src/index.ts read --email-id <id> --message-id <id> --json
bun run src/index.ts read --email-id <id> --message-id <id> --format html
```

- [ ] **Step 3: Commit**

```bash
git add packages/cli/
git commit -m "feat(cli): add read command"
```

---

### Task 9: Delete Command

**Files:**
- Create: `packages/cli/src/commands/delete.ts`
- Modify: `packages/cli/src/index.ts`

- [ ] **Step 1: Implement delete command**

`packages/cli/src/commands/delete.ts`:
```ts
import { Command } from "commander";
import { api } from "../api.js";
import { log, printJson, printText } from "../output.js";

export function registerDeleteCommand(program: Command) {
  program
    .command("delete")
    .description("Delete a mailbox or message")
    .requiredOption("--email-id <id>", "email ID")
    .option("--message-id <id>", "message ID (omit to delete entire mailbox)")
    .action(async (opts) => {
      const json = program.opts().json;
      try {
        if (opts.messageId) {
          await api.deleteMessage(opts.emailId, opts.messageId);
          if (json) {
            printJson({ success: true });
          } else {
            printText(`Deleted message ${opts.messageId}`);
          }
        } else {
          await api.deleteEmail(opts.emailId);
          if (json) {
            printJson({ success: true });
          } else {
            printText(`Deleted mailbox ${opts.emailId}`);
          }
        }
      } catch (e: any) {
        log(`Error: ${e.message}`);
        process.exit(1);
      }
    });
}
```

- [ ] **Step 2: Register in index.ts and test**

```bash
bun run src/index.ts delete --email-id <id> --json
```

- [ ] **Step 3: Commit**

```bash
git add packages/cli/
git commit -m "feat(cli): add delete command"
```

---

### Task 10: Server-Side Fix — Send Endpoint Auth

**Files:**
- Modify: `app/api/emails/[id]/send/route.ts`

This is required before the CLI `send` command can work with API keys.

- [ ] **Step 1: Read current send route**

Read `app/api/emails/[id]/send/route.ts` to locate the `auth()` call.

- [ ] **Step 2: Replace session auth with dual auth**

Three changes needed in the file:

**a) Import `getUserId` and replace auth call (line 2, 52-58):**
```ts
// Add import:
import { getUserId } from "@/lib/apiKey"

// Replace lines 52-58:
// Before:
const session = await auth()
if (!session?.user?.id) {
  return NextResponse.json({ error: "未授权" }, { status: 401 })
}

// After:
const userId = await getUserId()
if (!userId) {
  return NextResponse.json({ error: "未授权" }, { status: 401 })
}
```

**b) Update checkSendPermission call (line 63):**
```ts
// Before:
const permissionResult = await checkSendPermission(session.user.id)

// After:
const permissionResult = await checkSendPermission(userId)
```

**c) Update ownership check (line 93):**
```ts
// Before:
if (email.userId !== session.user.id) {

// After:
if (email.userId !== userId) {
```

Remove the now-unused `import { auth } from "@/lib/auth"` if no other usage remains.

- [ ] **Step 3: Verify the existing web UI still works**

Start the dev server and test sending an email through the web interface to confirm the change doesn't break session-based auth.

- [ ] **Step 4: Commit**

```bash
git add app/api/emails/[id]/send/route.ts
git commit -m "fix(api): support API Key auth for send endpoint"
```

---

### Task 11: Send Command

**Files:**
- Create: `packages/cli/src/commands/send.ts`
- Modify: `packages/cli/src/index.ts`

- [ ] **Step 1: Implement send command**

`packages/cli/src/commands/send.ts`:
```ts
import { Command } from "commander";
import { api } from "../api.js";
import { log, printJson, printText } from "../output.js";

export function registerSendCommand(program: Command) {
  program
    .command("send")
    .description("Send an email from a temporary address")
    .requiredOption("--email-id <id>", "email ID to send from")
    .requiredOption("--to <address>", "recipient email address")
    .requiredOption("--subject <subject>", "email subject")
    .requiredOption("--content <content>", "email body text")
    .action(async (opts) => {
      const json = program.opts().json;
      try {
        const result = (await api.sendEmail(opts.emailId, {
          to: opts.to,
          subject: opts.subject,
          content: opts.content,
        })) as any;

        if (json) {
          printJson({
            success: true,
            remainingEmails: result.remainingEmails,
          });
        } else {
          printText(`Email sent successfully. Remaining today: ${result.remainingEmails}`);
        }
      } catch (e: any) {
        log(`Error: ${e.message}`);
        process.exit(1);
      }
    });
}
```

- [ ] **Step 2: Register in index.ts and test**

```bash
bun run src/index.ts send --email-id <id> --to test@example.com --subject "Test" --content "Hello" --json
```

- [ ] **Step 3: Commit**

```bash
git add packages/cli/
git commit -m "feat(cli): add send command"
```

---

### Task 12: README

**Files:**
- Create: `packages/cli/README.md`

- [ ] **Step 1: Write README**

Include:
- One-line description: "Agent-first CLI for ZorMail temporary email service"
- Install: `npm i -g zormail-cli`
- Quick start (3 steps: config → create → wait)
- Command reference table (all 7 commands with key flags)
- Agent workflow example (the bash script from the spec)
- JSON output format note
- Exit codes table
- Link to ZorMail main project

- [ ] **Step 2: Commit**

```bash
git add packages/cli/README.md
git commit -m "docs(cli): add README with usage guide and agent workflow"
```

---

### Task 13: llms.txt

**Files:**
- Create: `public/llms.txt`

- [ ] **Step 1: Create llms.txt**

Copy the content from the spec's "llms.txt" section into `public/llms.txt`.

- [ ] **Step 2: Verify it's accessible**

With the dev server running, visit `http://localhost:3000/llms.txt` and confirm it serves the text file.

- [ ] **Step 3: Commit**

```bash
git add public/llms.txt
git commit -m "feat: add llms.txt for AI agent discoverability"
```

---

### Task 14: CI/CD — Publish Workflow

**Files:**
- Create: `.github/workflows/publish-cli.yml`

- [ ] **Step 1: Create workflow file**

`.github/workflows/publish-cli.yml`:
```yaml
name: Publish CLI

on:
  push:
    tags:
      - 'cli-v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
          cache: 'pnpm'

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2

      - name: Install dependencies
        run: cd packages/cli && pnpm install --frozen-lockfile

      - name: Build
        run: cd packages/cli && bun build ./src/index.ts --outdir ./dist --target=node

      - name: Publish to npm
        run: cd packages/cli && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/publish-cli.yml
git commit -m "ci: add CLI publish workflow triggered by cli-v* tags"
```

---

### Task 15: Final Integration Test

- [ ] **Step 1: Full workflow test**

Run the complete agent workflow from the spec against the running dev server:

```bash
cd packages/cli

# Configure
bun run src/index.ts config set api-url http://localhost:3000
bun run src/index.ts config set api-key <your-test-api-key>

# Create
EMAIL=$(bun run src/index.ts create --expiry 1h --json)
echo $EMAIL

# List
bun run src/index.ts list --json

# Wait (in background, then send test email)
# This requires a real email to be sent to the temp address

# Read (use a message ID from list)
bun run src/index.ts list --email-id <id> --json

# Delete
bun run src/index.ts delete --email-id <id> --json
```

- [ ] **Step 2: Build and test as npm package**

```bash
cd packages/cli
bun build ./src/index.ts --outdir ./dist --target=node
node dist/index.js --version
node dist/index.js --help
node dist/index.js config list
```

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat(cli): complete CLI implementation with all commands"
```
