const tape = require('tape');
const it = require('tape-promise').default(tape);
const memLog = require('../mem-log');
const test = require('..');

const common = {
  setup: async (t) => {
    return memLog();
  },
  teardown: async (t, log) => {
  }
};

test(it, common);
