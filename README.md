# node-record
> An node-task compliant Buffer with promised-based piping.

## API
See node-task [Record] specification(http://github.com/node-task/spec/wiki/Record).

## Usage
```js
var Record = require('record');
var record =  new Record('path/to/source');
record.source; // path/to/source
record.content('foo'); // <Record "path/to/source" <Buffer 66 6f 6f>>
record.toString(); // 'foo'
record.content('data').toString(); // 'data'
record.content(new Buffer('whatever')).toString(); // 'whatever'
record.content(new Buffer('64617461', 'hex')).toString(); // 'data'

var record =  new Record('path/to/source', 'hex');
record.content('data'); // TypeError: Invalid hex string (encoding defaults to hex)
record.content(new Buffer('data','utf8')).toString(); // '64617461'

var record =  new Record('path/to/source','utf8','foo');
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