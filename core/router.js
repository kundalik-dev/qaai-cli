import path from 'path';
import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { execute } from './executor.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function route(argv) {
  const [level1, level2, ...args] = argv;

  if (!level1 || level1 === 'help') {
    const helpPath = path.join(__dirname, '..', 'commands', 'help', 'index.js');
    const { default: helpFn } = await import(pathToFileURL(helpPath).href);
    await execute(helpFn, []);
    return;
  }

  // Try two-level path: commands/<level1>/<level2>.js
  const twoLevelPath = level2
    ? path.join(__dirname, '..', 'commands', level1, `${level2}.js`)
    : null;

  // Fall back to index: commands/<level1>/index.js
  const indexPath = path.join(__dirname, '..', 'commands', level1, 'index.js');

  let commandPath = null;
  if (twoLevelPath && fs.existsSync(twoLevelPath)) {
    commandPath = twoLevelPath;
  } else if (fs.existsSync(indexPath)) {
    commandPath = indexPath;
    if (level2) args.unshift(level2);
  }

  if (!commandPath) {
    console.error(`Unknown command: qaai ${[level1, level2].filter(Boolean).join(' ')}`);
    console.error(`Run "qaai help" to see all available commands.`);
    process.exit(1);
  }

  const { default: commandFn } = await import(pathToFileURL(commandPath).href);
  await execute(commandFn, args);
}
