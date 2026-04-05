#!/usr/bin/env node

const { route } = require('../core/router');

const args = process.argv.slice(2);
route(args);
