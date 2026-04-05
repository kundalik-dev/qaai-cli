# QAAI CLI — Build Guide

> npm-publishable CLI tool. Install globally on any laptop with `npm install -g qaai`.

---

## Step 1: Initialize Project

```bash
cd D:/cli/jk-cli
npm init -y
```

Update `package.json`:

```json
{
  "name": "qaai",
  "version": "1.0.0",
  "description": "Personal CLI for automating commands, opening websites, and launching apps",
  "main": "bin/index.js",
  "bin": {
    "qaai": "./bin/index.js"
  },
  "keywords": ["cli", "automation", "productivity"],
  "author": "kunda",
  "license": "MIT"
}
```

Install dependencies:

```bash
npm install commander open
```

- `commander` — CLI argument parsing
- `open` — cross-platform URL/app opening

---

## Step 2: Create Folder Structure

```bash
mkdir bin core commands commands/open commands/search commands/app commands/dev config utils
```

Final structure:

```
jk-cli/
├── bin/
│   └── index.js              # CLI entry point (shebang required)
├── core/
│   ├── router.js             # Maps CLI args → command file
│   └── executor.js           # Loads and runs command module
├── commands/
│   ├── open/
│   │   └── chrome.js         # qaai open chrome <site>
│   ├── search/
│   │   └── google.js         # qaai search google <query>
│   ├── app/
│   │   └── vscode.js         # qaai app vscode
│   └── dev/
│       └── start.js          # qaai dev start
├── config/
│   └── shortcuts.json        # URL aliases
├── utils/
│   └── os.js                 # Cross-platform helpers
├── package.json
└── README.md
```

---

## Step 3: Build Files (in order)

### 3.1 — `utils/os.js`

Platform detection helper. Used by command files to open URLs/apps correctly.

```js
const { exec } = require('child_process');

function getPlatform() {
  return process.platform; // 'win32', 'darwin', 'linux'
}

function openUrl(url) {
  const cmds = {
    win32: `start "" "${url}"`,
    darwin: `open "${url}"`,
    linux: `xdg-open "${url}"`,
  };
  const cmd = cmds[process.platform];
  if (!cmd) throw new Error(`Unsupported platform: ${process.platform}`);
  exec(cmd);
}

function openApp(appCommand) {
  exec(appCommand, (err) => {
    if (err) console.error(`Failed to open app: ${err.message}`);
  });
}

module.exports = { getPlatform, openUrl, openApp };
```

---

### 3.2 — `config/shortcuts.json`

URL aliases used by `open` and `search` commands.

```json
{
  "github": "https://github.com",
  "google": "https://www.google.com",
  "youtube": "https://www.youtube.com",
  "stackoverflow": "https://stackoverflow.com",
  "qaplayground": "https://qaplayground.com",
  "chatgpt": "https://chat.openai.com",
  "claude": "https://claude.ai"
}
```

---

### 3.3 — `core/router.js`

Takes CLI args and resolves to a command file path + remaining args.

```js
const path = require('path');
const fs = require('fs');

function route(args) {
  // args = ['open', 'chrome', 'github'] from process.argv.slice(2)
  if (args.length === 0) {
    return { error: 'No command provided. Usage: qaai <category> <command> [args]' };
  }

  const category = args[0];        // e.g., 'open'
  const command = args[1];          // e.g., 'chrome'
  const commandArgs = args.slice(2); // e.g., ['github']

  if (!command) {
    return { error: `Missing command. Usage: qaai ${category} <command> [args]` };
  }

  const commandPath = path.join(__dirname, '..', 'commands', category, `${command}.js`);

  if (!fs.existsSync(commandPath)) {
    return { error: `Unknown command: qaai ${category} ${command}` };
  }

  return { commandPath, commandArgs };
}

module.exports = { route };
```

---

### 3.4 — `core/executor.js`

Dynamically loads the resolved command module and runs it.

```js
async function execute(commandPath, args) {
  try {
    const commandFn = require(commandPath);
    await commandFn(args);
  } catch (err) {
    console.error(`Execution error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { execute };
```

---

### 3.5 — `bin/index.js` (Entry Point)

**IMPORTANT:** Must start with `#!/usr/bin/env node` — this is what makes it executable as a CLI.

```js
#!/usr/bin/env node

const { route } = require('../core/router');
const { execute } = require('../core/executor');

const args = process.argv.slice(2);
const result = route(args);

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

execute(result.commandPath, result.commandArgs);
```

---

### 3.6 — `commands/open/chrome.js`

Opens a website. Looks up shortcut name from `shortcuts.json`, falls back to raw URL.

```js
const open = require('open');
const shortcuts = require('../../config/shortcuts.json');

module.exports = async (args) => {
  const site = args[0];
  if (!site) {
    console.error('Usage: qaai open chrome <site>');
    return;
  }

  const url = shortcuts[site] || (site.startsWith('http') ? site : `https://${site}`);
  console.log(`Opening ${url}...`);
  await open(url);
};
```

**Usage:**

```bash
qaai open chrome github       # opens https://github.com (from shortcuts)
qaai open chrome example.com  # opens https://example.com
```

---

### 3.7 — `commands/search/google.js`

Opens a Google search with the provided query.

```js
const open = require('open');

module.exports = async (args) => {
  const query = args.join(' ');
  if (!query) {
    console.error('Usage: qaai search google <query>');
    return;
  }

  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  console.log(`Searching Google for "${query}"...`);
  await open(url);
};
```

**Usage:**

```bash
qaai search google react hooks
qaai search google "javascript closures"
```

---

### 3.8 — `commands/app/vscode.js`

Launches VS Code.

```js
const { exec } = require('child_process');

module.exports = async (args) => {
  const folder = args[0] || '.';
  console.log(`Opening VS Code in ${folder}...`);
  exec(`code ${folder}`, (err) => {
    if (err) console.error(`Failed to open VS Code: ${err.message}`);
  });
};
```

**Usage:**

```bash
qaai app vscode              # opens vscode in current dir
qaai app vscode D:/projects  # opens vscode in specific dir
```

---

### 3.9 — `commands/dev/start.js`

Runs a custom dev workflow. Customize this to your needs.

```js
const { exec } = require('child_process');

module.exports = async (args) => {
  console.log('Starting dev environment...');
  // customize this to your workflow
  const commands = [
    'echo Dev environment starting...',
    // add your dev startup commands here
  ];

  for (const cmd of commands) {
    exec(cmd, (err, stdout) => {
      if (err) console.error(err.message);
      if (stdout) console.log(stdout);
    });
  }
};
```

---

## Step 4: Test Locally

```bash
# Link globally so "qaai" works in terminal
npm link

# Test commands
qaai open chrome github
qaai search google "react hooks"
qaai app vscode
qaai dev start

# Unlink when done testing
npm unlink -g qaai
```

---

## Step 5: Prepare for npm Publish

### 5.1 — Create `.npmignore`

```
PLAN.md
cli-plan.md
.git
node_modules
```

### 5.2 — Create `README.md`

Add a basic readme with install instructions and command examples.

### 5.3 — Verify package.json checklist

- [ ] `"name"` is unique on npm (check https://www.npmjs.com/package/qaai)
- [ ] `"version"` starts at `1.0.0`
- [ ] `"bin"` points to `./bin/index.js`
- [ ] `"description"` is filled in
- [ ] `"keywords"` are set
- [ ] `"license"` is set
- [ ] All runtime deps are in `"dependencies"` (not devDependencies)

---

## Step 6: Publish to npm

```bash
# Login (one-time)
npm login

# Dry run first to see what gets published
npm publish --dry-run

# Publish for real
npm publish

# If "qaai" name is taken, use a scoped name:
# Change name in package.json to "@yourusername/qaai"
# Then: npm publish --access public
```

---

## Step 7: Install on Any Laptop

```bash
npm install -g qaai
qaai open chrome github
```

To update later:

```bash
# bump version in package.json, then:
npm publish

# on other machines:
npm update -g qaai
```

---

## Adding New Commands

To add a new command, just create a file in the right folder:

**Example:** Add `qaai open chrome linkedin`

1. Add to `config/shortcuts.json`:
   ```json
   "linkedin": "https://www.linkedin.com"
   ```
2. Done — `chrome.js` already reads from shortcuts.

**Example:** Add `qaai app chrome`

1. Create `commands/app/chrome.js`:
   ```js
   const { exec } = require('child_process');
   module.exports = async () => {
     exec('start chrome', (err) => {
       if (err) console.error(err.message);
     });
   };
   ```
2. Done — router auto-discovers it.

---

## Common Issues

| Problem | Fix |
|---------|-----|
| `qaai` not found after `npm link` | Restart terminal, or check `npm prefix -g` is in PATH |
| Permission denied on Linux/Mac | Run `chmod +x bin/index.js` |
| `open` package not working | Make sure it's in `dependencies`, run `npm install` |
| Name taken on npm | Use scoped name: `@yourusername/qaai` |
| Shebang not working on Windows | Node handles this via npm — should work. If not, check Node is in PATH |

---

## Phase Roadmap

| Phase | Features | Status |
|-------|----------|--------|
| Phase 1 (MVP) | open URLs, launch apps, search, dev commands | Build this first |
| Phase 2 | command aliases, fallback search, HTML dashboard | After MVP works |
| Phase 3 | fuzzy search, command chaining, env configs | Later |
| Phase 4 | plugin system, AI command interpretation | Future |