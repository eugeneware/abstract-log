const tape = require('tape');
const it = require('tape-promise').default(tape);
const memLog = require('../mem-log');
const test = require('..');

test(it, memLog);
