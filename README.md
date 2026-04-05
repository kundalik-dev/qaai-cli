# QAAI CLI

A personal command-line automation tool for opening websites, searching the web, and launching apps — designed to read like plain English.

---

## Installation

### From npm (global)

```bash
npm install -g qaai
```

### For local development

```bash
git clone https://github.com/your-username/qaai.git
cd qaai
npm link
```

---

## Usage

Every command has two equally valid forms:

```
qaai <verb> [args]      # natural language
qaai -<flag> [args]     # dash shorthand
```

**Flag rule:** every flag is the first letter of its verb — no memorization needed.

| Verb     | Flag |
| -------- | ---- |
| `go`     | `-g` |
| `search` | `-s` |
| `launch` | `-l` |
| `dash`   | `-d` |
| `help`   | `-h` |

---

## Commands

### `go` / `-g` — Navigate to websites

Open one or more websites by shortcut name or URL. Separate multiple targets with commas or spaces — they all open at once.

```bash
# Single
qaai go github
qaai -g qaplayground

# Multiple (comma-separated)
qaai go github,gmail,youtube
qaai -g github,stackoverflow

# Multiple (space-separated)
qaai go github gmail youtube

# Raw URLs
qaai go https://npmjs.com
qaai go github,https://npmjs.com
```

---

### `search` / `-s` — Search Google

Search Google and open the results in your browser.

```bash
qaai search react hooks tutorial
qaai search "how to center a div in css"

qaai -s cypress element locators
qaai -s "best practices for API testing"
```

---

### `launch` / `-l` — Launch a desktop app

Open a registered application. Optionally pass a path to open it at a specific location.

```bash
qaai launch vscode
qaai launch postman
qaai launch vscode D:\projects\myapp

qaai -l vscode
qaai -l vscode D:\projects\myapp
```

Run with no args to list all available apps:

```bash
qaai launch
```

> For VSCode: requires the `code` command in your PATH.
> In VSCode: `Ctrl+Shift+P` → **Shell Command: Install 'code' command in PATH**

---

### `dash` / `-d` — Command dashboard

Open the visual command reference UI in your browser.

```bash
qaai dash             # opens http://localhost:3131
qaai dash 8080        # opens http://localhost:8080

qaai -d
qaai -d 8080
```

---

### `help` / `-h` — Show help

Print all commands, shortcuts, and registered apps.

```bash
qaai help
qaai -h
```

---

## Quick Reference

| Intent              | Natural                        | Dash                      |
| ------------------- | ------------------------------ | ------------------------- |
| Open one site       | `qaai go github`               | `qaai -g github`          |
| Open multiple sites | `qaai go github,gmail,youtube` | `qaai -g github,gmail`    |
| Search Google       | `qaai search react hooks`      | `qaai -s react hooks`     |
| Launch an app       | `qaai launch vscode`           | `qaai -l vscode`          |
| Launch app at path  | `qaai launch vscode D:\myapp`  | `qaai -l vscode D:\myapp` |
| Open dashboard      | `qaai dash`                    | `qaai -d`                 |
| Show help           | `qaai help`                    | `qaai -h`                 |

---

## URL Shortcuts

Shortcuts are defined in `config/shortcuts.json`.

| Shortcut       | URL                      |
| -------------- | ------------------------ |
| `github`       | https://github.com       |
| `gmail`        | https://mail.google.com  |
| `youtube`      | https://youtube.com      |
| `qaplayground` | https://qaplayground.com |
| `npmjs`        | https://npmjs.com        |
| `localhost`    | http://localhost:3000    |

### Adding a shortcut

Edit `config/shortcuts.json`:

```json
{
  "github": "https://github.com",
  "myapp": "https://my-deployed-app.com"
}
```

Use it immediately:

```bash
qaai go myapp
qaai go github,myapp
```

---

## Registered Apps

Apps are defined in `config/apps.json`.

| Name       | Opens              |
| ---------- | ------------------ |
| `vscode`   | Visual Studio Code |
| `brave`    | Brave Browser      |
| `chrome`   | Google Chrome      |
| `firefox`  | Mozilla Firefox    |
| `postman`  | Postman            |
| `notepad`  | Notepad            |
| `explorer` | File Explorer      |

### Adding an app

Edit `config/apps.json`:

```json
{
  "vscode": "code",
  "myapp": "C:\\Path\\To\\MyApp.exe"
}
```

Use it immediately:

```bash
qaai launch myapp
qaai -l myapp
```

---

## Project Structure

```
qaai/
 ├── bin/
 │   └── index.js           # CLI entry point
 ├── core/
 │   ├── router.js          # Command routing + dash flag aliases
 │   └── executor.js        # Async execution & error handling
 ├── commands/
 │   ├── go/index.js        # qaai go  /  qaai -g
 │   ├── search/index.js    # qaai search  /  qaai -s
 │   ├── launch/index.js    # qaai launch  /  qaai -l
 │   ├── dash/index.js      # qaai dash  /  qaai -d
 │   └── help/index.js      # qaai help  /  qaai -h
 ├── config/
 │   ├── shortcuts.json     # URL shortcut aliases
 │   └── apps.json          # Registered desktop apps
 ├── utils/
 │   └── os.js              # Cross-platform helpers (openUrl, openApp)
 └── commands.html          # Dashboard UI (served by qaai dash)
```

---

## Adding a New Command

1. Create `commands/<verb>/index.js` — name it after what the user types
2. Export a default async function that accepts an `args` array
3. Optionally add a dash flag to the `ALIASES` map in `core/router.js`

```js
// commands/go/index.js
import { openUrl } from "../../utils/os.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shortcuts = JSON.parse(
  readFileSync(path.join(__dirname, "../../config/shortcuts.json"), "utf8"),
);

export default async (args) => {
  const targets = args
    .flatMap((arg) => arg.split(",").map((t) => t.trim()))
    .filter(Boolean);
  targets.forEach((target) => {
    const url =
      shortcuts[target] ||
      (target.startsWith("http") ? target : `https://${target}`);
    openUrl(url);
  });
};
```

To register a dash flag for your new command, add one line to `core/router.js`:

```js
const ALIASES = {
  "-g": "go",
  "-s": "search",
  "-l": "launch",
  "-d": "dash",
  "-h": "help",
  "-x": "myverb", // your new flag
};
```

---

## Contributing

Contributions are welcome. This is a personal productivity tool, so the bar is practical value — does it make daily terminal use faster or cleaner?

### Getting started

```bash
git clone https://github.com/your-username/qaai.git
cd qaai
npm link
```

### What to contribute

- **New shortcuts** — add to `config/shortcuts.json`, no code needed
- **New apps** — add to `config/apps.json`, no code needed
- **New commands** — create `commands/<verb>/index.js`, export an async function, optionally add a dash flag to `core/router.js`
- **Bug fixes** — check open issues first
- **Platform fixes** — especially macOS/Linux edge cases in `utils/os.js`

### Guidelines

- Keep commands readable — one clear verb, no filler words
- File names must match the verb the user types (e.g. `commands/go/` not `commands/open/chrome/`)
- No new dependencies unless absolutely necessary — the goal is zero runtime deps
- Test on Windows first (primary platform), note if macOS/Linux behavior differs

### Submitting a PR

1. Fork the repo
2. Create a branch: `git checkout -b feat/my-command`
3. Make your changes
4. Open a pull request with a short description of what it does and why

### Guidelines

| Prefix      | Meaning                                                                      | Example                                     |
| ----------- | ---------------------------------------------------------------------------- | ------------------------------------------- |
| `feat:`     | Feature: A new piece of functionality for the user.                          | `feat: add multi-tab support`               |
| `fix:`      | Bug Fix: A fix for a bug in the codebase.                                    | `fix: prefer canonical last activity`       |
| `chore:`    | Maintenance: Routine tasks that don't modify source code.                    | `chore: restore pnpm-lock.yaml`             |
| `docs:`     | Documentation: Changes to READMEs, wikis, or internal comments.              | `docs: add v2 release changelog`            |
| `refactor:` | Code Improvement: Changing code to be cleaner without changing its behavior. | `refactor: simplify router alias map`       |
| `test:`     | Testing: Adding or correcting existing tests.                                | `test: update tests for SchemaConfigFields` |

---

## Platform Support

| Platform | Status    |
| -------- | --------- |
| Windows  | Primary   |
| macOS    | Supported |
| Linux    | Supported |

---

## License

MIT
