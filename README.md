# abstract-log

An abstract interface to build data processing applications on a log-based architecture.

[![build status](https://secure.travis-ci.org/eugeneware/abstract-log.png)](http://travis-ci.org/eugeneware/abstract-log)

The idea would be to have implementations that would allow reading/writing to files, databases, kafka, redis, etc.

This is basically [abstract-blob-store](https://github.com/maxogden/abstract-blob-store) for append-only logs.

To understand all this append only log stuff and why it's useful to build data processing systems, watch this [great talk](https://www.youtube.com/watch?v=fU9hR3kiOK0) by Martin Kleppman.

Basically Kafka is all good and well, but very heavy until you need that kind of scale. This project enables you to build on this kind of architecture and then scale up to bigger logging back-ends when you need to.

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

## abstract-log Implementations

* [mem-log](https://github.com/eugeneware/abstract-log/blob/master/mem-log.js) - Reference implementation
* [fs-log](https://github.com/eugeneware/fs-log) - A very simple JSON text file log
* [knex-log](https://github.com/noblesamurai/knex-log) - Uses the `knex` database library to log to postgres, sqlite, mysql, etc

## TODO

NB: Please feel free to contribute implementations. PRs welcome!

* [levelup](https://github.com/level/level) - log to leveldb
* [kafka](https://github.com/sohu-co/kafka-node) - log to kafka
* [hyperlog](https://github.com/mafintosh/hyperlog) - P2P distribute logs
* [S3](https://github.com/aws/aws-sdk-js) - batch writes and log to S3, or even an `abstract-blob-store`
* [redis](https://github.com/noderedis/node_redis) - log to redis
* [ipfs](https://github.com/noffle/ipfs-hyperlog) - log to IPFS using scuttlebut logs for replication

## Libraries helpful for implementations

Some logs don't have efficient push mechanisms for changes. So you have to poll for changes. Check out [polling-stream](https://github.com/noblesamurai/polling-stream) which helps you create a perpetual stream of changes.

## Docs

WIP. Currently - See [tests](https://github.com/eugeneware/abstract-log/blob/master/test/abstract/test.js).
