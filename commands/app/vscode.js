const { exec } = require('child_process');

module.exports = async (args) => {
  const target = args[0] || '.';
  console.log(`Opening VSCode at: ${target}`);

  exec(`code "${target}"`, (err) => {
    if (err) {
      console.error(`Failed to open VSCode: ${err.message}`);
      console.error('Make sure "code" is in your PATH (VSCode shell command installed).');
      process.exit(1);
    }
  });
};
