# QAAI CLI

A personal command-line automation tool for opening websites, searching the web, launching apps, and running dev workflows — fast.

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

```
qaai <command> [subcommand] [args]
```

---

## Commands

### `qaai open chrome <shortcut|url>`

Open a website in Chrome. Pass a shortcut alias or a full URL.

```bash
qaai open chrome github           # opens https://github.com
qaai open chrome gmail            # opens https://mail.google.com
qaai open chrome youtube          # opens https://youtube.com
qaai open chrome https://example.com   # opens any URL directly
```

---

### `qaai search google <query>`

Search Google and open the results in your browser.

```bash
qaai search google react hooks
qaai search google how to center a div in css
```

---

### `qaai app vscode [path]`

Open Visual Studio Code. Defaults to the current directory.

```bash
qaai app vscode               # opens VSCode in current dir
qaai app vscode ./my-project  # opens VSCode at a specific path
```

> Requires the `code` command in your PATH. In VSCode: `Ctrl+Shift+P` → **Shell Command: Install 'code' command in PATH**

---

### `qaai serve dashboard [port]`

Serve the command reference UI in your browser. Default port is `3131`.

```bash
qaai serve dashboard          # http://localhost:3131
qaai serve dashboard 8080     # http://localhost:8080
```

---

### `qaai help`

Print all available commands with descriptions and URL shortcuts.

```bash
qaai help
```

---

## URL Shortcuts

Shortcuts are defined in `config/shortcuts.json`. Edit this file to add your own.

| Shortcut       | URL                      |
| -------------- | ------------------------ |
| `github`       | https://github.com       |
| `gmail`        | https://mail.google.com  |
| `youtube`      | https://youtube.com      |
| `qaplayground` | https://qaplayground.com |
| `npmjs`        | https://npmjs.com        |
| `localhost`    | http://localhost:3000    |

### Adding a custom shortcut

Open `config/shortcuts.json` and add your alias:

```json
{
  "github": "https://github.com",
  "myapp": "https://my-deployed-app.com"
}
```

Then use it immediately:

```bash
qaai open chrome myapp
```

---

## Project Structure

```
qaai/
 ├── bin/
 │   └── index.js          # CLI entry point
 ├── core/
 │   ├── router.js         # Command routing
 │   └── executor.js       # Async execution & error handling
 ├── commands/
 │   ├── open/chrome.js    # qaai open chrome
 │   ├── search/google.js  # qaai search google
 │   ├── app/vscode.js     # qaai app vscode
 │   ├── serve/dashboard.js# qaai serve dashboard
 │   └── help/index.js     # qaai help
 ├── config/
 │   ├── shortcuts.json    # URL alias map
 │   └── settings.json     # Default settings
 ├── utils/
 │   └── os.js             # Cross-platform open helpers
 └── commands.html         # Visual command reference (served by qaai serve dashboard)
```

---

## Adding a New Command

1. Create a file at `commands/<category>/<name>.js`
2. Export an async function that accepts an args array

```js
// commands/open/firefox.js
const { openUrl } = require("../../utils/os");
const shortcuts = require("../../config/shortcuts.json");

module.exports = async (args) => {
  const [target] = args;
  const url =
    shortcuts[target] ||
    (target.startsWith("http") ? target : `https://${target}`);
  // open with firefox instead of default
  require("child_process").exec(`start firefox "${url}"`);
};
```

Then use it:

```bash
qaai open firefox github
```

---

## Platform Support

| Platform | Status       |
| -------- | ------------ |
| Windows  | ✅ Primary   |
| macOS    | ✅ Supported |
| Linux    | ✅ Supported |

---

## License

MIT
