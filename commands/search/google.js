const { openUrl } = require('../../utils/os');

module.exports = async (args) => {
  if (!args.length) {
    console.error('Usage: qaai search google <query>');
    process.exit(1);
  }

  const query = args.join(' ');
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  console.log(`Searching Google for: ${query}`);
  openUrl(url);
};
