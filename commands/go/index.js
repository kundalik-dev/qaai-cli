import { openUrl } from '../../utils/os.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shortcuts = JSON.parse(readFileSync(path.join(__dirname, '../../config/shortcuts.json'), 'utf8'));

export default async (args) => {
  const [target] = args;

  if (!target) {
    console.error('Usage: qaai go <url|shortcut>');
    process.exit(1);
  }

  const url = shortcuts[target] || (target.startsWith('http') ? target : `https://${target}`);
  console.log(`Opening ${url}...`);
  openUrl(url);
};
