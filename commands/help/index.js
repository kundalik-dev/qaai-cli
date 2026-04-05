module.exports = async () => {
  const c = {
    reset:  '\x1b[0m',
    bold:   '\x1b[1m',
    dim:    '\x1b[2m',
    yellow: '\x1b[33m',
    cyan:   '\x1b[36m',
    green:  '\x1b[32m',
    white:  '\x1b[37m',
  };

  const heading = (text) => `\n${c.yellow}${c.bold}  ${text}${c.reset}`;
  const cmd     = (command, desc) =>
    `  ${c.cyan}${command.padEnd(38)}${c.reset}${c.dim}${desc}${c.reset}`;

  console.log(`\n${c.bold}${c.white}  QAAI CLI${c.reset}  ${c.dim}— personal automation tool${c.reset}`);
  console.log(`  ${c.dim}Usage: qaai <command> [subcommand] [args]${c.reset}`);

  console.log(heading('Open Websites'));
  console.log(cmd('qaai open chrome <shortcut|url>', 'Open a URL or shortcut in Chrome'));
  console.log(cmd('qaai open chrome github',         '→ opens https://github.com'));
  console.log(cmd('qaai open chrome https://...',    '→ opens any URL directly'));

  console.log(heading('Search'));
  console.log(cmd('qaai search google <query>',      'Search Google and open result'));

  console.log(heading('Open Apps'));
  console.log(cmd('qaai app vscode [path]',          'Open VSCode (defaults to current dir)'));

  console.log(heading('Dashboard'));
  console.log(cmd('qaai serve dashboard [port]',     'Serve the command reference UI (default :3131)'));

  console.log(heading('URL Shortcuts  (config/shortcuts.json)'));
  const shortcuts = require('../../config/shortcuts.json');
  Object.entries(shortcuts).forEach(([alias, url]) => {
    console.log(cmd(`  ${alias}`, url));
  });

  console.log(`\n${c.dim}  Tip: edit config/shortcuts.json to add your own shortcuts.${c.reset}\n`);
};
