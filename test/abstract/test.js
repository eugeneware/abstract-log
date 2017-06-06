const streamToPromise = require('stream-to-promise');
const arrayToStream = require('array-to-stream');

module.exports = (it, common) => {
  it('should be able to append to the log', async (t) => {
    t.plan(1);
    let log = await common.setup(t);
    await log.open();
    let offset = await log.append({ msg: 'hello world' });
    t.equal(offset, 0);
    await log.close();
    await common.teardown(t, log);
    t.end();
  });

  it('should be able to read from a log offset', async (t) => {
    t.plan(1);
    let log = await common.setup(t);
    await log.open();
    let offset = await log.append({ msg: 'hello world' });
    let data = await log.get(offset);
    t.deepEqual(data, { msg: 'hello world' });
    await log.close();
    await common.teardown(t, log);
    t.end();
  });

  it('should be able to stream from a log offset', async (t) => {
    t.plan(1);

    let startFrom;
    let log = await common.setup(t);
    await log.open();
    let expected = [];
    for (let i = 0; i < 5; i++) {
      let data = { msg: `hello world ${i}` };
      let offset = await log.append(data);
      if (i === 3) startFrom = offset;
      if (i >= 3) expected.push({ offset, value: data });
    }

    let results = await streamToPromise(log.createReadStream({ offset: startFrom }));
    t.deepEqual(results, expected);
    await log.close();
    await common.teardown(t, log);
    t.end();
  });

  it('should be able to write a stream to the log', async (t) => {
    t.plan(6);

    let log = await common.setup(t);
    await log.open();
    await streamToPromise(
      arrayToStream([0, 1, 2, 3, 4].map((i) => ({ msg: `hello world ${i}` })))
        .pipe(log.createWriteStream())
    );
    let results = await streamToPromise(log.createReadStream());
    results.forEach((data, i) => {
      t.deepEqual(data, { offset: i, value: { msg: `hello world ${i}` } });
    });
    t.equal(results.length, 5);
    await log.close();
    await common.teardown(t, log);
    t.end();
  });
};
