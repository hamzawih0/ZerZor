# ZorMail CLI — Agent-First Command Line Tool

## Overview

A CLI tool that wraps ZorMail's existing OpenAPI, optimized for AI Agent workflows. Agents can create temporary emails, wait for incoming messages, read content, and manage mailboxes through simple shell commands.

**Goal:** Make ZorMail a first-class tool in any AI Agent's toolchain with minimal friction — one command per action, structured JSON output, minimal server-side changes.

**Server-side changes:** One small change required — the `POST /api/emails/{id}/send` endpoint currently uses session-only auth. It needs to be updated to also support API Key auth (switch from `auth()` to `getUserId()`) so the CLI `send` command works.

## Architecture

```
Agent (Claude / GPT / Custom)
    ↓ shell call
zormail CLI (npm package, bun-built single JS file)
    ↓ HTTPS + X-API-Key header
ZorMail Server (existing Next.js API, one minor auth change for send endpoint)
    ↓
Cloudflare D1 / Email Workers
```

- **Language:** TypeScript
- **Build:** `bun build ./src/index.ts --outdir ./dist --target=node`
- **Distribution:** npm package, `npm i -g zormail-cli`
- **Binary:** `package.json` `bin` field points to `dist/index.js`
- **Location:** `packages/cli/` in the monorepo
- **Server changes:** One change — update send endpoint to support API Key auth.

## Configuration

Stored at `~/.zormail/config.json`:

```json
{
  "apiUrl": "https://zormail.app",
  "apiKey": "mk_xxxxxxxx"
}
```

Environment variable overrides (higher priority):
- `ZORMAIL_API_URL`
- `ZORMAIL_API_KEY`

## Commands

All commands support `--json` for JSON output, `--help` for usage info, and `zormail --version` for version.

**Field naming convention:** CLI JSON output uses camelCase (`messageId`, `receivedAt`, `fromAddress`). The API uses snake_case (`message_id`, `received_at`, `from_address`). The CLI transforms all field names to camelCase, and converts epoch ms timestamps to ISO 8601 strings.

### `zormail config`

```bash
# Interactive setup
zormail config

# Direct set
zormail config set api-url https://zormail.app
zormail config set api-key mk_xxxxxxxx

# View current config
zormail config list
```

### `zormail create`

```bash
# Random prefix, 1h expiry (defaults)
zormail create

# With parameters
zormail create --name test --domain zormail.app --expiry 24h
```

`--expiry` options and API mapping:

| CLI flag | API `expiryTime` (ms) |
|----------|----------------------|
| `1h` | `3600000` |
| `24h` | `86400000` |
| `3d` | `259200000` |
| `permanent` | `0` |

Default output:
```
Created: test@zormail.app (expires in 24 hours)
ID: abc-123
```

JSON output (`--json`):
```json
{"id": "abc-123", "address": "test@zormail.app", "expiresAt": "2026-03-23T12:00:00Z"}
```

Note: The API returns `{ id, email }`. The CLI renames `email` → `address` for clarity, and computes `expiresAt` from the chosen expiry option.

### `zormail list`

```bash
# List all mailboxes
zormail list

# List messages in a mailbox
zormail list --email-id xxx

# With pagination
zormail list --cursor xxx
```

JSON output — mailboxes (`--json`):
```json
{"emails": [{"id": "abc-123", "address": "test@zormail.app", "expiresAt": "..."}], "nextCursor": "xxx", "total": 5}
```

JSON output — messages (`--json --email-id xxx`):
```json
{"messages": [{"id": "msg-1", "from": "sender@example.com", "subject": "Hello", "receivedAt": "..."}], "nextCursor": null, "total": 2}
```

### `zormail wait`

The core command for Agent workflows. Polls the API until a new message arrives or timeout.

```bash
# Wait for new message (default: 120s timeout, 5s interval)
zormail wait --email-id xxx

# Custom timeout and interval
zormail wait --email-id xxx --timeout 60 --interval 3
```

**Parameters:** `--timeout` and `--interval` are in seconds.

**Behavior:**
1. Fetch current message list, record all existing message IDs in a Set
2. Poll `GET /api/emails/{id}` every `--interval` seconds
3. Compare returned message IDs against the initial Set to detect new messages (ID-based, not count-based — safe against concurrent deletes)
4. On new message: output message summary and exit with code 0
5. On timeout: exit with code 1

Default output:
```
Polling... (15/120s)
New message from no-reply@github.com: "Verify your email"
Message ID: msg-456
```

JSON output (`--json`):
```json
{"messageId": "msg-456", "from": "no-reply@github.com", "subject": "Verify your email", "receivedAt": "2026-03-22T12:05:00Z"}
```

### `zormail read`

```bash
# Read message (default: plain text)
zormail read --email-id xxx --message-id yyy

# HTML format
zormail read --email-id xxx --message-id yyy --format html
```

`--format` options: `text` (default) | `html`

JSON output (`--json`):
```json
{"id": "msg-456", "from": "no-reply@github.com", "to": "test@zormail.app", "subject": "Verify your email", "content": "Your code is 123456", "html": "<p>Your code is 123456</p>", "receivedAt": "2026-03-22T12:05:00Z", "type": "received"}
```

### `zormail send`

```bash
zormail send --email-id xxx --to user@example.com --subject "Hello" --content "Body text"
```

JSON output (`--json`):
```json
{"success": true, "remainingEmails": 4}
```

### `zormail delete`

```bash
# Delete mailbox and all messages
zormail delete --email-id xxx

# Delete single message
zormail delete --email-id xxx --message-id yyy
```

JSON output (`--json`):
```json
{"success": true}
```

## Output Specification

### Modes

| Mode | Flag | Format | Use case |
|------|------|--------|----------|
| Text | (default) | Human-readable | Debugging, manual use |
| JSON | `--json` | Single-line JSON on stdout | Agent consumption |

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Operation failed (timeout, not found, bad params) |
| 2 | Auth failed (invalid/expired API Key) |

### Error Handling

- Errors write to **stderr**, never stdout
- In `--json` mode, stdout contains only valid JSON (or nothing on failure)
- Agent reads stdout for data, checks exit code for success/failure

```bash
$ zormail wait --email-id xxx --timeout 10 --json
# stderr: Polling... (3/10s)
# stderr: Timeout: no new messages received
# stdout: (empty)
# exit code: 1
```

## Project Structure

```
packages/cli/
├── src/
│   ├── index.ts          # Entry point, command registration
│   ├── commands/
│   │   ├── config.ts     # config command
│   │   ├── create.ts     # create command
│   │   ├── list.ts       # list command
│   │   ├── wait.ts       # wait command (client-side polling)
│   │   ├── read.ts       # read command
│   │   ├── send.ts       # send command
│   │   └── delete.ts     # delete command
│   ├── api.ts            # HTTP client wrapping all API calls
│   ├── config.ts         # Read/write ~/.zormail/config.json
│   └── output.ts         # Output formatting (text / json)
├── package.json
├── tsconfig.json
└── README.md
```

## Dependencies

- **commander** — CLI argument parsing and subcommand routing
- All other needs (HTTP, filesystem) use Node.js built-in APIs

## Relationship to Main Project

- Lives in `packages/cli/`, published as a separate npm package
- No code shared with the main Next.js app
- Only coupling is the API contract (URLs, request/response shapes)
- Server-side: one change — send endpoint auth support for API Key

## CI/CD Publishing

CLI 通过独立的 GitHub Actions workflow 发布到 npm，与主项目的 deploy workflow 分开。

### Workflow: `.github/workflows/publish-cli.yml`

**触发条件：**
- Push tag 匹配 `cli-v*`（如 `cli-v1.0.0`），与主项目的 `v*` tag 区分

**流程：**
1. Checkout 代码
2. Setup pnpm + Node.js 20
3. Install dependencies（`pnpm install --frozen-lockfile`）
4. Build CLI（`cd packages/cli && bun build ./src/index.ts --outdir ./dist --target=node`）
5. Publish to npm（`cd packages/cli && npm publish --access public`）

**所需 Secrets：**
- `NPM_TOKEN`：npm publish token，在 GitHub repo Settings → Secrets 中配置

### 发布步骤

```bash
# 1. 更新 packages/cli/package.json 中的 version
# 2. Commit & push
# 3. 打 tag 并推送
git tag cli-v1.0.0
git push origin cli-v1.0.0
```

### 版本策略

CLI 独立版本号，不与主项目同步。遵循 semver：
- **patch**：bug fix
- **minor**：新增命令或 flag
- **major**：破坏性变更（命令重命名、输出格式变更）

## Agent Discoverability

三层机制让 AI Agent 知道如何使用 CLI。

### 1. CLI 内置 Help

Commander 自动生成，Agent 调用一次即可获取完整用法：

```bash
$ zormail --help
Usage: zormail [options] [command]

ZorMail CLI — Agent-friendly temporary email tool

Options:
  -V, --version       output the version number
  --json              output as JSON
  -h, --help          display help for command

Commands:
  config              configure API endpoint and API Key
  create [options]    create a temporary email address
  list [options]      list mailboxes or messages
  wait [options]      wait for a new email to arrive
  read [options]      read an email message
  send [options]      send an email from a temporary address
  delete [options]    delete a mailbox or message

$ zormail create --help
Usage: zormail create [options]

Create a temporary email address

Options:
  --name <name>       email prefix (default: random)
  --domain <domain>   email domain
  --expiry <expiry>   1h | 24h | 3d | permanent (default: "1h")
  --json              output as JSON
  -h, --help          display help for command
```

### 2. README 文档

`packages/cli/README.md` 作为 npm 包首页展示，包含：
- 一句话介绍：Agent-first CLI for ZorMail temporary email service
- 安装命令
- 快速开始（3 步：config → create → wait）
- 完整命令参考表
- Agent workflow 示例
- JSON 输出格式说明

### 3. llms.txt

在 ZorMail 站点根目录提供 `https://zormail.app/llms.txt`，遵循 llms.txt 协议。Agent 访问网站时自动发现可用工具。

```
# ZorMail

> Temporary email service with CLI tool for AI Agents

ZorMail provides disposable email addresses. Install the CLI for programmatic access:

## CLI Tool

Install: npm i -g zormail-cli

Setup: zormail config set api-url https://zormail.app && zormail config set api-key YOUR_KEY

Commands:
- zormail create --domain <domain> --expiry <1h|24h|3d|permanent> --json
- zormail list --json
- zormail list --email-id <id> --json
- zormail wait --email-id <id> --timeout <seconds> --json
- zormail read --email-id <id> --message-id <id> --json
- zormail send --email-id <id> --to <addr> --subject <subj> --content <body> --json
- zormail delete --email-id <id> --json

Typical workflow: create email → use address for signup → wait for verification → read content → extract code → delete

All commands support --json for structured output. Exit code 0 = success, 1 = failure, 2 = auth error.
```

**实现方式：** 在 Next.js 的 `public/` 目录下放置 `llms.txt` 静态文件，部署时自动可访问。

## Typical Agent Workflow

```bash
# 1. Create a temporary mailbox
EMAIL=$(zormail create --domain zormail.app --expiry 1h --json)
EMAIL_ID=$(echo $EMAIL | jq -r '.id')
ADDRESS=$(echo $EMAIL | jq -r '.address')

# 2. Use the address to sign up for a service (agent does this elsewhere)

# 3. Wait for verification email
MSG=$(zormail wait --email-id $EMAIL_ID --timeout 120 --json)
MSG_ID=$(echo $MSG | jq -r '.messageId')

# 4. Read the email content
CONTENT=$(zormail read --email-id $EMAIL_ID --message-id $MSG_ID --json)

# 5. Agent extracts verification code from content (LLM does this)

# 6. Clean up
zormail delete --email-id $EMAIL_ID
```
