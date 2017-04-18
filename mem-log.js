const { Readable, Writable } = require('stream');
module.exports = MemLog;

function MemLog () {
  this.log = [];
  this.tail = 0;
  if (!(this instanceof MemLog)) {
    return new MemLog();
  }
}

MemLog.prototype.append = async function (data) {
  this.log[this.tail] = data;
  let offset = this.tail;
  this.tail++;
  return offset;
};

MemLog.prototype.get = async function (offset) {
  let data = this.log[offset];
  if (typeof data === 'undefined') {
    throw new Error(`Illegal offset - ${offset}`);
  }
  return data;
};

MemLog.prototype.createReadStream = function ({ offset = 0 } = {}) {
  let rs = Readable({ objectMode: true });
  let i = offset;
  rs._read = () => {
    if (i < this.tail) {
      rs.push({ offset: i, value: this.log[i] });
      i++;
    } else {
      rs.push(null);
    }
  };
  return rs;
};

MemLog.prototype.createWriteStream = function () {
  let ws = Writable({ objectMode: true });
  ws._write = (data, enc, cb) => {
    this.append(data)
      .then(() => {
        cb();
      })
      .catch(cb);
  };
  return ws;
};
