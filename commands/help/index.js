import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shortcuts = JSON.parse(readFileSync(path.join(__dirname, '../../config/shortcuts.json'), 'utf8'));
const appsConfig = JSON.parse(readFileSync(path.join(__dirname, '../../config/apps.json'), 'utf8'));

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
  console.log(`  ${c.dim}Usage: qaai <command|flag> [args]${c.reset}`);

  console.log(heading('Natural Language'));
  console.log(row('qaai go <shortcut|url>',       'Navigate to a URL or saved shortcut'));
  console.log(row('qaai search <query...>',        'Search Google for anything'));
  console.log(row('qaai launch <app> [path]',      'Launch a registered desktop app'));
  console.log(row('qaai dash [port]',              'Open the command dashboard (default :3131)'));
  console.log(row('qaai help',                     'Show this help'));

  console.log(heading('Dash Flags (shorthand)'));
  console.log(row('qaai -g <shortcut|url>',        'Same as: go'));
  console.log(row('qaai -s <query...>',            'Same as: search'));
  console.log(row('qaai -l <app> [path]',          'Same as: launch'));
  console.log(row('qaai -d [port]',                'Same as: dash'));
  console.log(row('qaai -h',                       'Same as: help'));

  console.log(heading('URL Shortcuts  (config/shortcuts.json)'));
  Object.entries(shortcuts).forEach(([alias, url]) => {
    console.log(row(`  ${alias}`, url));
  });

  console.log(heading('Apps  (config/apps.json)'));
  console.log(`  ${c.dim}${Object.keys(appsConfig).join('   ')}${c.reset}`);

  console.log(`\n${c.dim}  Tip: edit config/shortcuts.json and config/apps.json to add your own.${c.reset}\n`);
};
