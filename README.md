# WTHek Error Handling - Agent Skill & Plugin

[![npm version](https://img.shields.io/npm/v/%40wthek%2Ferror-handling.svg)](https://www.npmjs.com/package/@wthek/error-handling)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Workflow](https://img.shields.io/github/actions/workflow/status/Skillnter/wthek-error-handling/main.yml?branch=main)](https://github.com/Skillnter/wthek-error-handling/actions)
[![Socket](https://socket.dev/api/badge/npm/package/@wthek/error-handling)](https://socket.dev/npm/package/@wthek/error-handling)
[![Skills](https://skills.sh/b/Skillnter/wthek-error-handling)](https://skills.sh/Skillnter/wthek-error-handling)
![Antigravity Plugin](https://img.shields.io/badge/Antigravity-Plugin_Included-4285F4?logo=google&logoColor=white) 
![Agent Skills](https://img.shields.io/badge/Agent_Skills-Format-0F766E?logo=githubcopilot&logoColor=white) 
![MCP](https://img.shields.io/badge/MCP-Error_Handling-2563EB?logo=protocols.io&logoColor=white)

An AI agent skill and Antigravity plugin that helps developers and AI coding assistants implement consistent **HHTTP and MCP error handling**H across Node.js applications.

Includes framework-specific instructions, integration examples, and best practices for RFC 7807 / RFC 9457 Problem Details, HTTP status codes (RFC 9110), validation error handling, and MCP error responses.

It provides instructions, recipes, and best practices for RFC 7807 / RFC 9457 Problem Details, standard HTTP status codes (RFC 9110), validation error transformations, and standardized MCP error responses using `@wthek`, [`http-error-kit`](https://www.npmjs.com/package/http-error-kit), and [`http-response-status-code`](https://www.npmjs.com/package/http-response-status-code).

---

## What Is This?

Error handling in Node.js backend services and AI agents is often fragmented—every framework has its own middleware signature, validation libraries format errors differently, and MCP tool errors frequently lack consistent structure.

**WTHek Error Handling** bridges this gap for both humans and AI coding assistants. It serves as an on-demand instruction bundle and Antigravity plugin that helps developers and coding agents (Google Antigravity, Cursor, Claude Code, GitHub Copilot, Windsurf) implement, refactor, and review error handling patterns with zero guesswork.

---

## Features

### Framework Support
Production-ready error handling patterns and middleware integrations for 6 major Node.js frameworks:
- **Express.js** ([`@wthek/express-middleware`](https://www.npmjs.com/package/@wthek/express-middleware))
- **Fastify** ([`@wthek/fastify-middleware`](https://www.npmjs.com/package/@wthek/fastify-middleware))
- **Hono** ([`@wthek/hono-middleware`](https://www.npmjs.com/package/@wthek/hono-middleware))
- **Koa** ([`@wthek/koa-middleware`](https://www.npmjs.com/package/@wthek/koa-middleware))
- **NestJS** ([`@wthek/nestjs-middleware`](https://www.npmjs.com/package/@wthek/nestjs-middleware))
- **Restify** ([`@wthek/restify-middleware`](https://www.npmjs.com/package/@wthek/restify-middleware))

### Validation Support
Seamless error transformation pipelines for popular TypeScript/JavaScript schema validation libraries:
- **Zod** ([`@wthek/zod-transformer`](https://www.npmjs.com/package/@wthek/zod-transformer), [`@wthek/zod-express-interceptor`](https://www.npmjs.com/package/@wthek/zod-express-interceptor))
- **Valibot** ([`@wthek/valibot-transformer`](https://www.npmjs.com/package/@wthek/valibot-transformer))
- **TypeBox** ([`@wthek/typebox-transformer`](https://www.npmjs.com/package/@wthek/typebox-transformer))

### Standards and Specifications
- **RFC 7807 & RFC 9457**: Standardized Problem Details for HTTP APIs using `application/problem+json`.
- **RFC 9110**: Semantically correct HTTP status codes and headers.
- **Type-safe status codes**: Named constants, categories, and helpers provided by [`http-response-status-code`](https://www.npmjs.com/package/http-response-status-code).

### Model Context Protocol (MCP)
Dedicated guidance and utilities for AI agent tool and server development:
- **[`@wthek/mcp-error-formatter`](https://www.npmjs.com/package/@wthek/mcp-error-formatter)**: Format and standardize errors thrown inside MCP tools (`isError: true` responses).
- **[`@wthek/mcp`](https://www.npmjs.com/package/@wthek/mcp)**: Build standalone Model Context Protocol servers with built-in error containment.

### AI Agent Integration
When added to a workspace, the skill equips AI coding agents to:
- Follow consistent error handling conventions across your entire codebase.
- Pick the right middleware and transformer packages for each framework.
- Avoid asynchronous race conditions (e.g. `res.headersSent` or `reply.sent`).
- Standardize API errors to RFC-compliant Problem Details.
- Review and audit existing error handlers for gaps.

---

## Installation

You can install the skill into your current project, configure it globally, or add it as an npm development dependency.

### Method 1: Install Using NPX (Recommended)

Install directly into your current workspace:

```bash
npx @wthek/error-handling
```

By default, the skill is installed at:
```text
.agents/skills/wthek-error-handling
```

#### Other Target Locations:

```bash
# Install globally as an Antigravity plugin (~/.gemini/config/plugins/wthek-error-handling)
npx @wthek/error-handling --global

# Install into GitHub workflows & Copilot skills directory (.github/skills/wthek-error-handling)
npx @wthek/error-handling --github

# Install into a custom directory
npx @wthek/error-handling --dest ./my-skills/wthek-error-handling
```

---

### Method 2: Install as an npm Dependency

Install the package as a development dependency:

```bash
npm install -D @wthek/error-handling
```

Then run the bundled CLI to install the skill into your workspace:

```bash
npx wthek-error-handling
```

#### Programmatic Usage

The package exports helper functions to inspect paths and manifests programmatically:

```typescript
import { getSkillPath, getPluginManifest, installSkill } from "@wthek/error-handling";

console.log("Skill directory:", getSkillPath());
console.log("Plugin manifest:", getPluginManifest());

// Programmatically trigger installation:
installSkill({ github: true });
```

---

### Method 3: Install Directly as an Antigravity Plugin

The repository includes a `plugin.json` manifest at its root. You can clone the repository directly into your Antigravity plugins directory:

```bash
git clone https://github.com/Skillnter/wthek-error-handling.git ~/.gemini/config/plugins/wthek-error-handling
```

Once installed, Antigravity will discover the **WTHek Error Handling** plugin with all skills, prompts, and recipes enabled.

---

## Package Selection Guide

| Framework / Requirement | Primary Package | Validation Integration |
| :--- | :--- | :--- |
| **Express.js** | [`@wthek/express-middleware`](https://www.npmjs.com/package/@wthek/express-middleware) | [`@wthek/zod-express-interceptor`](https://www.npmjs.com/package/@wthek/zod-express-interceptor), [`@wthek/zod-transformer`](https://www.npmjs.com/package/@wthek/zod-transformer), [`@wthek/valibot-transformer`](https://www.npmjs.com/package/@wthek/valibot-transformer), [`@wthek/typebox-transformer`](https://www.npmjs.com/package/@wthek/typebox-transformer) |
| **Fastify** | [`@wthek/fastify-middleware`](https://www.npmjs.com/package/@wthek/fastify-middleware) | [`@wthek/zod-transformer`](https://www.npmjs.com/package/@wthek/zod-transformer), [`@wthek/valibot-transformer`](https://www.npmjs.com/package/@wthek/valibot-transformer), [`@wthek/typebox-transformer`](https://www.npmjs.com/package/@wthek/typebox-transformer) |
| **Hono** | [`@wthek/hono-middleware`](https://www.npmjs.com/package/@wthek/hono-middleware) | [`@wthek/zod-transformer`](https://www.npmjs.com/package/@wthek/zod-transformer), [`@wthek/valibot-transformer`](https://www.npmjs.com/package/@wthek/valibot-transformer), [`@wthek/typebox-transformer`](https://www.npmjs.com/package/@wthek/typebox-transformer) |
| **Koa** | [`@wthek/koa-middleware`](https://www.npmjs.com/package/@wthek/koa-middleware) | [`@wthek/zod-transformer`](https://www.npmjs.com/package/@wthek/zod-transformer), [`@wthek/valibot-transformer`](https://www.npmjs.com/package/@wthek/valibot-transformer), [`@wthek/typebox-transformer`](https://www.npmjs.com/package/@wthek/typebox-transformer) |
| **NestJS** | [`@wthek/nestjs-middleware`](https://www.npmjs.com/package/@wthek/nestjs-middleware) | [`@wthek/zod-transformer`](https://www.npmjs.com/package/@wthek/zod-transformer), [`@wthek/valibot-transformer`](https://www.npmjs.com/package/@wthek/valibot-transformer), [`@wthek/typebox-transformer`](https://www.npmjs.com/package/@wthek/typebox-transformer) |
| **Restify** | [`@wthek/restify-middleware`](https://www.npmjs.com/package/@wthek/restify-middleware) | [`@wthek/zod-transformer`](https://www.npmjs.com/package/@wthek/zod-transformer), [`@wthek/valibot-transformer`](https://www.npmjs.com/package/@wthek/valibot-transformer), [`@wthek/typebox-transformer`](https://www.npmjs.com/package/@wthek/typebox-transformer) |
| **Model Context Protocol** | [`@wthek/mcp-error-formatter`](https://www.npmjs.com/package/@wthek/mcp-error-formatter) | [`@wthek/mcp`](https://www.npmjs.com/package/@wthek/mcp) (Server) |
| **Core Error Handling** | [`http-error-kit`](https://www.npmjs.com/package/http-error-kit) | [`http-response-status-code`](https://www.npmjs.com/package/http-response-status-code) |

---

## Project Structure

```text
wthek-error-handling/
├── plugin.json                    # Antigravity plugin manifest
├── package.json                   # npm package configuration
├── tsconfig.json                  # TypeScript compiler options
├── src/                           # TypeScript source code
│   ├── index.ts                   # Programmatic API exports
│   ├── bin.ts                     # CLI installer implementation
│   ├── installer.ts               # File copying & target resolution logic
│   └── types.ts                   # Type definitions & interfaces
├── dist/                          # Compiled CommonJS & .d.ts files
├── test/                          # 100% coverage Jest test suite
│   ├── index.spec.ts
│   ├── bin.spec.ts
│   └── installer.spec.ts
└── skills/
    └── wthek-error-handling/
        ├── SKILL.md               # Main AI agent skill instruction file
        ├── references/            # 12 detailed reference guides
        │   ├── express.md
        │   ├── fastify.md
        │   ├── hono.md
        │   ├── koa.md
        │   ├── nestjs.md
        │   ├── restify.md
        │   ├── zod.md
        │   ├── valibot.md
        │   ├── typebox.md
        │   ├── formatters.md      # RFC 7807 & RFC 9457 specifications
        │   ├── status-codes.md    # RFC 9110 status codes & helpers
        │   └── mcp.md             # Model Context Protocol error handling
        └── examples/              # Practical runnable code examples
            ├── express-zod.ts
            ├── express-zod.js
            ├── fastify-zod.ts
            ├── fastify-zod.js
            ├── hono-valibot.ts
            └── koa-typebox.ts
```

---

## CLI Reference

### Usage
```bash
npx @wthek/error-handling [command] [options]
```

### Commands
| Command | Description |
| :--- | :--- |
| `install` | Installs the skill into the selected directory (default command). |

### Options
| Option | Description |
| :--- | :--- |
| `--workspace`, `-w` | Install into the current workspace at `.agents/skills/wthek-error-handling` (default). |
| `--global`, `-g` | Install into global Antigravity config at `~/.gemini/config/plugins/wthek-error-handling`. |
| `--github` | Install into `.github/skills/wthek-error-handling`. |
| `--dest <path>` | Install into a custom directory path. |
| `--help`, `-h` | Display the CLI help message. |

---

## Author

The original author of the project is [Himanshu Bansal][skillnter]

## Donations

**This is all voluntary work**, so if you want to support my efforts you can:

- [Buy Me A Coffee](https://www.buymeacoffee.com/skillnter)
- [PayPal](https://www.paypal.com/paypalme/skillnter)
- [GitHub Sponsors](https://github.com/sponsors/Skillnter)
- [Patreon](https://www.patreon.com/skillnter)
- [Open Collective](https://opencollective.com/skillnter)

You can also use the following crypto addresses:

![BTC: bc1p22h4nsad5d8ketyhuvf0vyva6unttxwzzqvkty5r839as0mlclgs72d3mf](https://img.shields.io/badge/BTC-bc1p22h4nsad5d8ketyhuvf0vyva6unttxwzzqvkty5r839as0mlclgs72d3mf-brightgreen)

![ETH: 0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889](https://img.shields.io/badge/ETH-0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889-brightgreen)

![BNB: 0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889](https://img.shields.io/badge/BNB-0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889-brightgreen)

## License

`wthek-error-handling` project is open-sourced software licensed under the [MIT license](LICENSE) by [Himanshu Bansal][skillnter].

[skillnter]: https://github.com/Skillnter/
