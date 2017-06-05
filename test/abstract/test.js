const streamToPromise = require('stream-to-promise');
const arrayToStream = require('array-to-stream');

module.exports = (it, logImpl) => {
  it('should be able to append to the log', async (t) => {
    t.plan(1);
    let log = logImpl();
    let offset = await log.append({ msg: 'hello world' });
    t.equal(offset, 0);
    t.end();
  });

  it('should be able to read from a log offset', async (t) => {
    t.plan(1);
    let log = logImpl();
    let offset = await log.append({ msg: 'hello world' });
    let data = await log.get(offset);
    t.deepEqual(data, { msg: 'hello world' });
    t.end();
  });

  it('should be able to stream from a log offset', async (t) => {
    t.plan(6);

    let log = logImpl();
    for (let i = 0; i < 5; i++) {
      await log.append({ msg: `hello world ${i}` });
    }

    let results = await streamToPromise(log.createReadStream());
    results.forEach((data, i) => {
      t.deepEqual(data, { offset: i, value: { msg: `hello world ${i}` } });
    });
    t.equal(results.length, 5);
    t.end();
  });

  it('should be able to write a stream to the log', async (t) => {
    t.plan(6);

    let log = logImpl();
    await streamToPromise(
      arrayToStream([0, 1, 2, 3, 4].map((i) => ({ msg: `hello world ${i}` })))
        .pipe(log.createWriteStream())
    );
    let results = await streamToPromise(log.createReadStream());
    results.forEach((data, i) => {
      t.deepEqual(data, { offset: i, value: { msg: `hello world ${i}` } });
    });
    t.equal(results.length, 5);
    t.end();
  });
};
