# QAAI CLI

A personal command-line automation tool for opening websites, searching the web, and launching apps — designed to read like plain English.

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

Now `qaai` is available globally in your terminal.

---

## Usage

Every command has two forms — a readable natural verb and a single-dash shorthand:

```
qaai <verb> [args]      # natural language
qaai -<flag> [args]     # dash shorthand
```

**Flag rule:** every flag is the first letter of its verb. No memorization needed.

---

## Commands

### Navigate to a URL — `go` / `-g`

Open a website shortcut or any URL in your browser.

```bash
qaai go github
qaai go qaplayground
qaai go https://npmjs.com

qaai -g github
qaai -g https://npmjs.com
```

---

### Search Google — `search` / `-s`

Search Google and open the results in your browser.

```bash
qaai search react hooks tutorial
qaai search "how to center a div in css"

qaai -s react hooks tutorial
qaai -s "cypress best practices"
```

---

### Launch an App — `launch` / `-l`

Open a registered desktop application. Optionally pass a path.

```bash
qaai launch vscode
qaai launch postman
qaai launch vscode D:\projects\myapp

qaai -l vscode
qaai -l vscode D:\projects\myapp
```

> For VSCode: requires the `code` command in your PATH.
> In VSCode: `Ctrl+Shift+P` → **Shell Command: Install 'code' command in PATH**

Available apps are defined in `config/apps.json`. Run `qaai launch` with no args to list them.

---

### Command Dashboard — `dash` / `-d`

Open the visual command reference UI in your browser.

```bash
qaai dash             # http://localhost:3131
qaai dash 8080        # http://localhost:8080

qaai -d
qaai -d 8080
```

---

### Help — `help` / `-h`

Print all available commands, shortcuts, and apps.

```bash
qaai help
qaai -h
```

---

## Quick Reference

| Intent | Natural | Dash |
|---|---|---|
| Go to a URL / shortcut | `qaai go github` | `qaai -g github` |
| Search Google | `qaai search react hooks` | `qaai -s react hooks` |
| Launch an app | `qaai launch vscode` | `qaai -l vscode` |
| Open dashboard | `qaai dash` | `qaai -d` |
| Show help | `qaai help` | `qaai -h` |

---

## URL Shortcuts

Shortcuts are defined in `config/shortcuts.json`.

| Shortcut | URL |
|---|---|
| `github` | https://github.com |
| `gmail` | https://mail.google.com |
| `youtube` | https://youtube.com |
| `qaplayground` | https://qaplayground.com |
| `npmjs` | https://npmjs.com |
| `localhost` | http://localhost:3000 |

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
qaai -g myapp
```

---

## Registered Apps

Apps are defined in `config/apps.json`.

| Name | Opens |
|---|---|
| `vscode` | Visual Studio Code |
| `brave` | Brave Browser |
| `chrome` | Google Chrome |
| `firefox` | Mozilla Firefox |
| `postman` | Postman |
| `notepad` | Notepad |
| `explorer` | File Explorer |

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
 │   ├── router.js          # Command routing + alias resolution
 │   └── executor.js        # Async execution & error handling
 ├── commands/
 │   ├── go/index.js        # qaai go  /  qaai -g
 │   ├── search/index.js    # qaai search  /  qaai -s
 │   ├── launch/index.js    # qaai launch  /  qaai -l
 │   ├── dash/index.js      # qaai dash  /  qaai -d
 │   └── help/index.js      # qaai help  /  qaai -h
 ├── config/
 │   ├── shortcuts.json     # URL alias map
 │   └── apps.json          # Registered desktop apps
 ├── utils/
 │   └── os.js              # Cross-platform open helpers
 └── commands.html          # Visual command reference (served by qaai dash)
```

---

## Adding a New Command

1. Create `commands/<verb>/index.js`
2. Export an async function that accepts an args array
3. Add a dash flag alias to `core/router.js` if needed

```js
// commands/go/index.js
import { openUrl } from '../../utils/os.js';
import { readFileSync } from 'fs';

const shortcuts = JSON.parse(readFileSync('./config/shortcuts.json', 'utf8'));

export default async (args) => {
  const [target] = args;
  const url = shortcuts[target] || (target.startsWith('http') ? target : `https://${target}`);
  openUrl(url);
};
```

---

## Platform Support

| Platform | Status |
|---|---|
| Windows | Primary |
| macOS | Supported |
| Linux | Supported |

---

## License

MIT
