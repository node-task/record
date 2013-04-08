# node-datapipe
> An extendable Node.js Buffer with promised-based piping.

This library was built to be used as a base class for [node-task](http://github.com/node-task/spec) buffer interfaces.

## API

### ::extend(config)
Create a new DataPipe constructor with the keys of config object assigned to its prototype.

### constructor(source, encoding)
Create instance of DataPipe with source and encoding assigned.  Encoding defaults to `utf8`.

### source
An identifier for the buffer's source path, url, object, etc.

### encoding
The buffer's encoding type.

### content(input)
Fill buffer synchronously and return self for chaining.  Input may be a Buffer or a string which is valid for the instance's encoding type.

### toString(encoding)
Return a string value for buffer.  If encoding is not specified, `this.encoding` will be used.

### clone()
Return a clone of the DataPipe instance.

### pipe(method)
Pass a clone of the DataPipe instance into method for processing and return a promise which resolves to the return value of said method.

## Usage:
```js
var DataPipe = require('datapipe');
var buffer = new DataPipe('path/to/source');
buffer.source; // path/to/source
buffer.content('foo'); // <Buffer 66 6f 6f>
buffer.toString(); // 'foo'
buffer.content('data').toString(); // 'data'
buffer.content(new Buffer('data')).toString(); // 'data'
buffer.content(new Buffer('64617461', 'hex')).toString(); // 'data'

var buffer = new DataPipe('path/to/source', 'hex');
buffer.content('data'); // TypeError: Invalid hex string (encoding defaults to hex)
buffer.content(new Buffer('data','utf8')).toString(); // '64617461'
```

## Extending:
See [node-filebuffer](https://github.com/tkellen/node-filebuffer/blob/master/lib/filebuffer.js)