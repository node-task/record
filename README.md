# node-record
> An node-task compliant Buffer with promised-based piping.

## API
See node-task [Record specification](http://github.com/node-task/spec/wiki/Record).

## Usage
```js
var Record = require('record');
var record = new Record('path/to/source');
record.path; // path/to/source
record.content('bar'); // <Record "path/to/source" <Buffer 62 61 72>>
record.toString(); // 'bar'
record.prepend('foo'); // <Record "path/to/source" <Buffer 62 61 72 66 6f 6f>>
record.append('baz').toString(); // 'foobarbaz'
record.content('data'); // <Record "path/to/source" <Buffer 64 61 74 61>>
record.content(new Buffer('whatever')).toString(); // 'whatever'
record.content(new Buffer('64617461', 'hex')).toString(); // 'data'

var record = new Record('path/to/source', 'hex');
record.content('data'); // TypeError: Invalid hex string (encoding defaults to hex)
record.content(new Buffer('data', 'utf8')).toString(); // '64617461'

var record = new Record('path/to/source', new Buffer('dudes')); // <Record "path/to/source" <Buffer 64 75 64 65 73>>

var record = new Record('path/to/source', 'utf8', 'foo');
var addBar = function(input) {
  return input.append(" bar");
};
var addBaz = function(input) {
  return input.append(" baz");
}
record.pipe(addBar).then(addBaz).then(function(piped) {
  console.log(piped.toString()); // 'foo bar baz'
});
```