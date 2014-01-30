const Stream = require('stream');
const test = require('tap').test;
const Record = require('../');

test('constructor', function (t) {

  test('will create a buffer if contents is a string', function (t) {
    var record = new Record({ contents: '64617461' });
    t.equal(Buffer.isBuffer(record.contents),true);
    t.end();
  });

  test('will throw on invalid content type', function (t) {
    t.throws(function () {
      new Record({contents:true});
    }, new Error('Contents can only be a Buffer, a Stream, or null.'));
    t.end();
  });

  t.end();
});

test('instance', function (t) {

  test('isNull()', function (t) {
    var record = new Record();
    t.equal(record.isNull(), true, 'can tell if is null backed');
    t.equal(record.isBuffer(), false);
    t.equal(record.isStream(), false);
    t.end();
  });

  test('isBuffer()', function (t) {
    var record = new Record({contents: new Buffer(0)});
    t.equal(record.isNull(), false);
    t.equal(record.isBuffer(), true, 'can tell if is buffer backed');
    t.equal(record.isStream(), false);
    t.end();
  });

  test('isStream()', function (t) {
    var record = new Record({contents: new Stream.Readable()});
    t.equal(record.isStream(), true, 'can tell if it is stream backed');
    t.end();
  });

  test('type()', function (t) {
    t.equal(new Record().type(), 'Null', 'should detect null type');
    t.equal(new Record({contents: new Buffer(0)}).type(), 'Buffer', 'should detect buffer type');
    t.equal(new Record({contents: new Stream.Readable()}).type(), 'ReadableStream', 'should detect stream type');
    t.equal(new Record({contents: new Stream.Writable()}).type(), 'WritableStream', 'should detect stream type');
    t.end();
  })

  test('clone()', function (t) {
    var buffer = new Buffer(0);
    var record = new Record({contents: buffer});
    var clone = record.clone();
    t.notEqual(record.contents, buffer.contents, 'can clone itself');
    t.end();
  });

  test('pipe()', function (t) {

    test('if content is buffer, writes buffer into provided stream', function (t) {
      t.plan(2);
      var buffer = new Buffer('buffer');
      var record = new Record({contents:buffer});
      var stream = new Stream.PassThrough();
      stream.on('data', function (chunk) {
        t.equal(chunk, buffer);
      });
      var piped = record.pipe(stream);
      t.equal(piped, stream, 'should return the stream');
      t.end();
    });

    test('if content is stream, should connect to provided stream', function (t) {
      t.plan(2);
      var buffer = new Buffer('buffer');
      var record = new Record({contents:new Stream.PassThrough()});
      var stream = new Stream.PassThrough();
      stream.on('data', function (chunk) {
        t.equal(chunk, buffer);
        t.end();
      });
      stream.on('end', function () { throw new Error(); });
      t.equal(record.pipe(stream), stream, 'should return the stream');
      record.contents.write(buffer);
    });

    test('if content is null, should do nothing', function (t) {
      var record = new Record();
      var stream = new Stream.PassThrough();
      var thrower = function () { throw new Error(); };
      stream.on('data', thrower);
      stream.on('end', function () { t.end(); });
      t.equal(record.pipe(stream), stream, 'should return the stream');
    });

    t.end();
  });

  t.end();
});
