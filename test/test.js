const tape = require('tape');
const it = require('tape-promise').default(tape);
const abstractLog = require('..');
const streamToPromise = require('stream-to-promise');

it('should be able to append to the log', async (t) => {
  t.plan(1);
  let log = abstractLog();
  let offset = await log.append({ msg: 'hello world' });
  t.equal(offset, 0);
  t.end();
});

it('should be able to read from a log offset', async (t) => {
  t.plan(1);
  let log = abstractLog();
  let offset = await log.append({ msg: 'hello world' });
  let data = await log.get(offset);
  t.deepEqual(data, { msg: 'hello world' });
  t.end();
});

it('should be able to stream from a log offset', async (t) => {
  t.plan(6);

  let log = abstractLog();
  for (let i = 0; i < 5; i++) {
    await log.append({ msg: `hello world ${i}` });
  }

  let results = await streamToPromise(log.createReadStream());
  results.forEach((data, i) => {
    t.equal(data.msg, `hello world ${i}`);
  });
  t.equal(results.length, 5);
  t.end();
});
