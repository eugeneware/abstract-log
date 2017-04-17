const { Readable } = require('stream');
module.exports = AbstractLog;

function AbstractLog () {
  this.log = [];
  this.tail = 0;
  if (!(this instanceof AbstractLog)) {
    return new AbstractLog();
  }
}

AbstractLog.prototype.append = async function (data) {
  this.log[this.tail] = data;
  let offset = this.tail;
  this.tail++;
  return offset;
};

AbstractLog.prototype.get = async function (offset) {
  let data = this.log[offset];
  if (typeof data === 'undefined') {
    throw new Error(`Illegal offset - ${offset}`);
  }
  return data;
};

AbstractLog.prototype.createReadStream = function (offset = 0) {
  let rs = Readable({ objectMode: true });
  let i = offset;
  rs._read = () => {
    if (i < this.tail) {
      rs.push({ key: i, value: this.log[i] });
      i++;
    } else {
      rs.push(null);
    }
  };
  return rs;
};
