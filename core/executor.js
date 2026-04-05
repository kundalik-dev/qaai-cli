async function execute(commandFn, args) {
  try {
    await commandFn(args);
  } catch (err) {
    console.error(`Error executing command: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { execute };
