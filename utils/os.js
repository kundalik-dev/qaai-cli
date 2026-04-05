import { exec } from 'child_process';
import os from 'os';

export function openUrl(url) {
  const platform = os.platform();
  const cmd = platform === 'win32' ? `start "" "${url}"`
            : platform === 'darwin' ? `open "${url}"`
            : `xdg-open "${url}"`;

  exec(cmd, (err) => {
    if (err) console.error(`Failed to open URL: ${err.message}`);
  });
}

export function openApp(appPath) {
  const platform = os.platform();
  const cmd = platform === 'win32' ? `start "" "${appPath}"`
            : platform === 'darwin' ? `open -a "${appPath}"`
            : `"${appPath}"`;

  exec(cmd, (err) => {
    if (err) console.error(`Failed to open app: ${err.message}`);
  });
}
