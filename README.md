# abstract-log

An abstract interface to build data processing applications on a log-based architecture.

[![build status](https://secure.travis-ci.org/eugeneware/abstract-log.png)](http://travis-ci.org/eugeneware/abstract-log)

The idea would be to have implementations that would allow reading/writing to files, databases, kafka, redis, etc.

## Status

Highly experimental.

## Usage

``` js
// There's a reference implementation of the memory based log included. Should be its own
// module
const memLog = require('abstract-log/mem-log');

// If this were a database log then you would pass through a connection string
let log = memLog();

// append to the log (currently the offset can be an object, not just an integer)
let offset = await log.append({ msg: 'hello world' });

// read from the log
let data = await log.get(offset);

// stream from the log
let offset = 0; // use 0 as initial offset as this is a memory log
log.createReadStream(offset)
   .on('data', console.log);

// stream to a log
const arrayToStream = require('array-to-stream');
arrayToStream([0, 1, 2, 3, 4].map((i) => ({ msg: `hello world ${i}` })))
  .pipe(log.createWriteStream());
```

## Docs

WIP. Currently - See tests.
