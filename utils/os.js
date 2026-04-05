const { exec } = require('child_process');
const os = require('os');

function openUrl(url) {
  const platform = os.platform();
  let cmd;

  if (platform === 'win32') {
    cmd = `start "" "${url}"`;
  } else if (platform === 'darwin') {
    cmd = `open "${url}"`;
  } else {
    cmd = `xdg-open "${url}"`;
  }

  exec(cmd, (err) => {
    if (err) console.error(`Failed to open URL: ${err.message}`);
  });
}

function openApp(appPath) {
  const platform = os.platform();
  let cmd;

  if (platform === 'win32') {
    cmd = `start "" "${appPath}"`;
  } else if (platform === 'darwin') {
    cmd = `open -a "${appPath}"`;
  } else {
    cmd = `"${appPath}"`;
  }

  exec(cmd, (err) => {
    if (err) console.error(`Failed to open app: ${err.message}`);
  });
}

module.exports = { openUrl, openApp };
