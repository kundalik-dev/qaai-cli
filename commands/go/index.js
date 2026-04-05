import { openUrl } from '../../utils/os.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shortcuts = JSON.parse(readFileSync(path.join(__dirname, '../../config/shortcuts.json'), 'utf8'));

export default async (args) => {
  if (!args.length) {
    console.error('Usage: qaai go <url|shortcut> [url|shortcut, ...]');
    process.exit(1);
  }

  // Support both comma-separated ("github,gmail") and space-separated ("github gmail")
  const targets = args.flatMap(arg => arg.split(',').map(t => t.trim())).filter(Boolean);

  targets.forEach(target => {
    const url = shortcuts[target] || (target.startsWith('http') ? target : `https://${target}`);
    console.log(`Opening ${url}...`);
    openUrl(url);
  });
};
