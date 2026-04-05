import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shortcuts = JSON.parse(readFileSync(path.join(__dirname, '../../config/shortcuts.json'), 'utf8'));

export default async () => {
  const c = {
    reset:  '\x1b[0m',
    bold:   '\x1b[1m',
    dim:    '\x1b[2m',
    yellow: '\x1b[33m',
    cyan:   '\x1b[36m',
    white:  '\x1b[37m',
  };

  const heading = (text) => `\n${c.yellow}${c.bold}  ${text}${c.reset}`;
  const row = (command, desc) =>
    `  ${c.cyan}${command.padEnd(38)}${c.reset}${c.dim}${desc}${c.reset}`;

  console.log(`\n${c.bold}${c.white}  QAAI CLI${c.reset}  ${c.dim}— personal automation tool${c.reset}`);
  console.log(`  ${c.dim}Usage: qaai <command> [subcommand] [args]${c.reset}`);

  console.log(heading('Open Websites'));
  console.log(row('qaai open chrome <shortcut|url>', 'Open a URL or shortcut in Chrome'));
  console.log(row('qaai open chrome github',         '→ opens https://github.com'));
  console.log(row('qaai open chrome https://...',    '→ opens any URL directly'));

  console.log(heading('Search'));
  console.log(row('qaai search google <query>',      'Search Google and open result'));

  console.log(heading('Open Apps'));
  console.log(row('qaai app <name> [path]',          'Open any registered app'));
  console.log(row('qaai app',                        '→ list all available apps'));

  console.log(heading('Dashboard'));
  console.log(row('qaai serve dashboard [port]',     'Serve the command reference UI (default :3131)'));

  console.log(heading('URL Shortcuts  (config/shortcuts.json)'));
  Object.entries(shortcuts).forEach(([alias, url]) => {
    console.log(row(`  ${alias}`, url));
  });

  console.log(`\n${c.dim}  Tip: edit config/shortcuts.json to add your own shortcuts.${c.reset}\n`);
};
