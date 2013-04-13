# node-record
> An node-task compliant Buffer with promised-based piping.

## API
Inherits [Node.js Buffer].
 See

## Usage
```js
var Record = require('record');
var record =  new Record('path/to/source');
record.source; // path/to/source
record.content('foo'); // <Buffer 66 6f 6f>
record.toString(); // 'foo'
record.content('data').toString(); // 'data'
record.content(new Buffer('data')).toString(); // 'data'
record.content(new Buffer('64617461', 'hex')).toString(); // 'data'

var record =  new Record('path/to/source', 'hex');
record.content('data'); // TypeError: Invalid hex string (encoding defaults to hex)
record.content(new Buffer('data','utf8')).toString(); // '64617461'

var record =  new Record('path/to/source');
record.content('foo');
var addBar = function(buffer) {
  var input = record.toString();
  return record.content(input+" bar");
};
var addBaz = function(buffer) {
  var input = record.toString();
  return record.content(input+" baz");
}
record.pipe(addBar).then(addBaz).then(function(piped) {
  console.log(piped.toString()); // 'foo bar baz'
});
```

[Node.js Buffer]: http://nodejs.org/api/record.html
[node-task]: http://github.com/node-task/spec
[node-filebuffer]: https://github.com/node-task/filebuffer/blob/master/lib/filerecord.js
[node-s3buffer]: https://github.com/node-task/s3buffer/blob/master/lib/s3record.js