const { Duplex } = require('stream');


module.exports = class BufferStream extends Duplex {
    constructor (...args) {
        super(...args);

        this.on('buf', this._readBuf);

        this._disposed = false;
        this._flushed  = false;
        this._enabled  = false;

        this._databuf  = [];
        this._id = Math.round(Math.random() * 1000);
    }

    _write(chunk, enc, cb) {
        this._databuf.push(chunk);

        this.emit('buf');

        process.nextTick(cb);
    }

    _final (cb) {
        this._disposed = true;

        this.emit('buf');

        cb();
    }

    _readBuf () {
        if (!this._enabled)
            return;

        const chunk = this._databuf.shift();

        if (chunk && this.push(chunk))
            return;

        if (!chunk && !this._disposed)
            return;

        if (!chunk && this._disposed && !this._flushed) {
            this._flushed = true;
            this.push(null);
        }

        this._enabled = false;
    }

    _read () {
        if (!this._enabled)
            this._enabled = true;

        for (let i = 0; i < this._databuf.length + 1; i++) {
            this.emit('buf');

            if (!this._enabled)
                return;
        }
    }
};
