import http from 'http';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async (args) => {
  const port = args[0] || 3131;
  const htmlFile = path.join(__dirname, '..', '..', 'commands.html');

  if (!fs.existsSync(htmlFile)) {
    console.error('commands.html not found at: ' + htmlFile);
    process.exit(1);
  }

  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(htmlFile).pipe(res);
  });

  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`\n  QAAI Dashboard running at ${url}\n`);
    console.log('  Press Ctrl+C to stop.\n');

    const platform = os.platform();
    const cmd = platform === 'win32' ? `start "" "${url}"`
              : platform === 'darwin' ? `open "${url}"`
              : `xdg-open "${url}"`;
    exec(cmd);
  });
};
