const path = require('path');
const fs = require('fs');
const { execute } = require('./executor');

async function route(argv) {
  const [level1, level2, ...args] = argv;

  // No args or explicit help → run help/index.js
  if (!level1 || level1 === 'help') {
    const helpPath = path.join(__dirname, '..', 'commands', 'help', 'index.js');
    const helpFn = require(helpPath);
    await execute(helpFn, []);
    return;
  }

  // Try two-level path first: commands/<level1>/<level2>.js
  const twoLevelPath = level2
    ? path.join(__dirname, '..', 'commands', level1, `${level2}.js`)
    : null;

  // Fall back to index: commands/<level1>/index.js (single-level commands)
  const indexPath = path.join(__dirname, '..', 'commands', level1, 'index.js');

  let commandPath = null;
  if (twoLevelPath && fs.existsSync(twoLevelPath)) {
    commandPath = twoLevelPath;
  } else if (fs.existsSync(indexPath)) {
    commandPath = indexPath;
    // level2 becomes first arg when falling back to index
    if (level2) args.unshift(level2);
  }

  if (!commandPath) {
    console.error(`Unknown command: qaai ${[level1, level2].filter(Boolean).join(' ')}`);
    console.error(`Run "qaai help" to see all available commands.`);
    process.exit(1);
  }

  const commandFn = require(commandPath);
  await execute(commandFn, args);
}

module.exports = { route };
