# record [![Build Status](https://secure.travis-ci.org/node-task/record.png)](http://travis-ci.org/node-task/record)
> The canonical implementation of node-task's [Record specification](https://github.com/node-task/spec/wiki/Record)

## Usage

```javascript
var Record = require('record');

var file = new Record({
  path: 'path/to/file',
  encoding: 'utf8',
  contents: 'i will be turned into a buffer'
});
```

### constructor(options)

#### options.path

Path to file.

Type: `String`  
Default: `null`  

#### options.contents

File contents.

Type: `Buffer, Stream, or null`  
Default: `null`  

#### options.encoding

A default encoding to be used with toString().

### type()

Return the type of Record. (Null, Buffer, ReadableStream, etc).

### isNull()

Return true if the record contents are null.

### isBuffer()

Return true if the record contents are a Buffer.

### isStream()

Return true if the record contents are a Stream.

### clone()

Return a clone of the record.

### toString()
*For usage with Buffer backed records only.*  Calls toString() on the underlying buffer. If no encoding is provided, the Record's optional encoding property will be used. If neither is available, will default to utf8 encoding.

### pipe(stream[, opt])

- If the record contents are a Buffer, it will be written to the provided stream.
- If the record contents are a Stream, pipe them to the provided stream.
- If the record contents are null, this will do nothing.
- If opt.end is true, [the destination stream will not be ended](http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options).

Returns the provided stream.
