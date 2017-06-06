const tape = require('tape');
const it = require('tape-promise').default(tape);
const memLog = require('../mem-log');
const test = require('..');

const common = {
  setup: async () => {
    return memLog();
  },
  teardown: async () => {
  }
};

test(it, common);
