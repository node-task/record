# node-datapipe
> An extendable Node.js Buffer class with promised-based piping.

This library was built to be used as a base class for [node-task] buffer interfaces.

## API
Inherits [Node.js Buffer].

### constructor(source, encoding, data)
Create a [Node.js Buffer] with additional properties and methods.

### source
An property identifying the buffer's source: filepath, url, object, etc.

### encoding
String property containing buffer's encoding.

### clone()
Return a clone of the instance.

### content(input)
Fill buffer synchronously and return self for chaining.  Input may be any Buffer, or a string which is valid for the instance's encoding.

### read(opts)
Read contents of source into buffer and return a promise which resolves to self.  If any additional parameters are required for loading (i.e. providing a s3 client), they can be passed in via opts.  If the buffer already contains data this should immediately return a promise which resolves to self.  This is a noop until extended (see [node-filebuffer] and [node-s3buffer] for examples).

### write(opts)
Write contents of buffer to source and return a promise which resolves to self.  If any additional parameters are required for saving (i.e. providing a s3 client, acl settings, etc), they can be passed via opts.  This is a noop until extended (see [node-filebuffer] and [node-s3buffer] for examples).

### pipe(method)
Load data into buffer (if not already loaded) and process it with `method`, yielding a promise which resolves to `methods`'s return value.

### ::extend(config)
Create a new DataPipe constructor with the keys of config object assigned to its prototype.  At a minimum, this should define read and write methods (see [node-filebuffer] and [node-s3buffer] for examples).

## Usage
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

var buffer = new DataPipe('path/to/source');
buffer.content('foo');
var addBar = function(buffer) {
  var input = buffer.toString();
  return buffer.content(input+" bar");
};
var addBaz = function(buffer) {
  var input = buffer.toString();
  return buffer.content(input+" baz");
}
buffer.pipe(addBar).then(addBaz).then(function(piped) {
  console.log(piped.toString()); // 'foo bar baz'
});
```

[Node.js Buffer]: http://nodejs.org/api/buffer.html
[node-task]: http://github.com/node-task/spec
[node-filebuffer]: https://github.com/node-task/filebuffer/blob/master/lib/filebuffer.js
[node-s3buffer]: https://github.com/node-task/s3buffer/blob/master/lib/s3buffer.js