const { openUrl } = require('../../utils/os');
const shortcuts = require('../../config/shortcuts.json');

module.exports = async (args) => {
  const [target, ...rest] = args;

  if (!target) {
    console.error('Usage: qaai open chrome <url|shortcut>');
    process.exit(1);
  }

  const url = shortcuts[target] || (target.startsWith('http') ? target : `https://${target}`);
  console.log(`Opening ${url} in Chrome...`);
  openUrl(url);
};
