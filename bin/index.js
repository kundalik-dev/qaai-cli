#!/usr/bin/env node

import { route } from '../core/router.js';

const args = process.argv.slice(2);
route(args);
