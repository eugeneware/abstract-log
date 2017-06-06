const { Readable, Writable } = require('stream');

module.exports = (...args) => {
  return new MemLog(...args);
};

class MemLog {
  constructor () {
    this.log = [];
    this.tail = 0;
  }

  async open () {
  }

  async close () {
  }

  async append (data)  {
    this.log[this.tail] = data;
    let offset = this.tail;
    this.tail++;
    return offset;
  };

  async get (offset) {
    let data = this.log[offset];
    if (typeof data === 'undefined') {
      throw new Error(`Illegal offset - ${offset}`);
    }
    return data;
  };

  createReadStream ({ offset = 0 } = {}) {
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

  createWriteStream () {
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
}

