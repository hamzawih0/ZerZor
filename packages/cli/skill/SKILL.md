---
name: ZorMail
description: Use when an AI agent needs a temporary/disposable email address — for receiving verification emails, testing email integrations, or any task requiring a temporary inbox via the ZorMail CLI
---

# ZorMail — Temporary Email for AI Agents

## Overview
ZorMail provides disposable email addresses with an agent-first CLI (`ZorMail`). Create inboxes, wait for messages, read content, and send emails programmatically.

## Install

Install the ZorMail CLI globally when it is not already available:

```bash
npm i -g @ZorMail/cli
```

Then confirm the binary is available:

```bash
ZorMail --help
```

## Setup

Configure once per environment:
```bash
ZorMail config set api-url https://ZorMail.app
ZorMail config set api-key YOUR_API_KEY
```

Or via environment variables: `ZorMail_API_URL`, `ZorMail_API_KEY`.

## Core Workflow: Receive an Email

```bash
# 1. Create inbox — capture ONCE, parse both fields
RESULT=$(ZorMail --json create --expiry 1h)
ID=$(echo "$RESULT" | jq -r '.id')
EMAIL=$(echo "$RESULT" | jq -r '.address')

# 2. Use $EMAIL wherever needed (registration, forms, etc.)

# 3. Wait for message (exits when message arrives or times out)
MSG=$(ZorMail --json wait --email-id "$ID" --timeout 120)
MSG_ID=$(echo "$MSG" | jq -r '.messageId')

# 4. Read full message content
ZorMail --json read --email-id "$ID" --message-id "$MSG_ID"
```

## Command Reference

| Command | Required Options | Notable Options |
|---------|-----------------|-----------------|
| `config set` | `<key> <value>` | keys: `api-url`, `api-key` |
| `create` | — | `--name`, `--domain`, `--expiry` (1h\|24h\|3d\|permanent) |
| `list` | — | `--email-id` (lists messages in mailbox), `--cursor` |
| `wait` | `--email-id` | `--timeout` (default 120s), `--interval` (default 5s) |
| `read` | `--email-id`, `--message-id` | `--format` (text\|html) |
| `send` | `--email-id`, `--to`, `--subject`, `--content` | — |
| `delete` | `--email-id` | — |

**Always put `--json` before the subcommand:**
```bash
ZorMail --json create --expiry 24h   # ✅ correct
ZorMail create --expiry 24h --json   # ❌ wrong position
```

## JSON Output Shapes

**create:** `{ "id": "...", "address": "user@domain.com", "expiresAt": "2025-..." }`

**wait:** `{ "messageId": "...", "from": "...", "subject": "...", "receivedAt": "2025-..." }`

**read:** `{ "id": "...", "from": "...", "to": "...", "subject": "...", "content": "plain text", "html": "...", "receivedAt": "..." }`

**send:** `{ "success": true, "remainingEmails": 10 }`

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Calling `create` twice to get id + address | Call once, save to variable, parse both fields |
| `--json` after subcommand | Move `--json` before the subcommand |
| Timeout too short for slow services | Use `--timeout 300` for unreliable senders |
| Inbox expired mid-test | Use `--expiry permanent` for long-running workflows |
| Using `content` field for HTML emails | Check both `content` (plain text) and `html` fields |


