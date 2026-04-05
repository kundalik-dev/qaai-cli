import { exec } from 'child_process';
import os from 'os';
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appsConfig = JSON.parse(readFileSync(path.join(__dirname, '../../config/apps.json'), 'utf8'));

export default async (args) => {
  const [appName, ...rest] = args;

  if (!appName) {
    console.error('Usage: qaai app <appname> [path]');
    console.error('\nAvailable apps:');
    Object.keys(appsConfig).forEach(name => console.error(`  ${name}`));
    console.error('\nTo add an app: edit config/apps.json');
    process.exit(1);
  }

  const entry = appsConfig[appName.toLowerCase()];

  if (!entry) {
    console.error(`Unknown app: "${appName}"`);
    console.error(`Run "qaai app" to see available apps, or add it to config/apps.json`);
    process.exit(1);
  }

  const appPath = entry.replace(/%([^%]+)%/g, (_, key) => process.env[key] || _);
  const extraArg = rest[0] || '';
  const platform = os.platform();

  let cmd;
  if (appPath === 'code') {
    cmd = `code "${extraArg || '.'}"`;
  } else if (platform === 'win32') {
    cmd = extraArg ? `start "" "${appPath}" "${extraArg}"` : `start "" "${appPath}"`;
  } else if (platform === 'darwin') {
    cmd = extraArg ? `open -a "${appPath}" "${extraArg}"` : `open -a "${appPath}"`;
  } else {
    cmd = extraArg ? `"${appPath}" "${extraArg}"` : `"${appPath}"`;
  }

  console.log(`Opening ${appName}...`);
  exec(cmd, (err) => {
    if (err) {
      console.error(`Failed to open ${appName}: ${err.message}`);
      console.error(`Check the path in config/apps.json for "${appName}"`);
      process.exit(1);
    }
  });
};
