var fs = require('fs');
var path = require('path');
var DataPipe = require('../lib/datapipe');
var when = require('when');

exports['DataPipe'] = {
  'constructor': function (test) {
    test.expect(5);
    test.equal((new DataPipe('test')).constructor, DataPipe, 'should create a datapipe instance');
    test.equal((new DataPipe('test')).source, 'test', 'should save buffer source');
    test.equal((new DataPipe('test')).encoding, 'utf8', 'should default to utf8 encoding');
    test.equal((new DataPipe('test', 'ascii')).encoding, 'ascii', 'should save encoding');
    test.equal((new DataPipe('test','utf8','content')).toString(), 'content', 'should allow initialization with value');
    test.done();
  },
  '#content': function (test) {
    test.expect(2);
    test.equal((new DataPipe('./fake/path')).content('data').toString(), 'data', 'should populate buffer instance with string');
    test.equal((new DataPipe('./fake/path')).content(new Buffer('data')).toString(), 'data', 'should populate buffer instance with buffer');
    test.done();
  },
  '#toString': function (test) {
    test.expect(1);
    test.equal((new DataPipe('./fake/path')).toString(), null, 'should return null if buffer has not been populated yet');
    test.done();
  },
  '#clone': function (test) {
    test.expect(2);
    var buffer = new DataPipe('path');
    buffer.content('yo');
    var copy = buffer.clone();
    test.equal(copy.toString(), 'yo', 'should return a clone of this instance');
    copy.content('changed');
    test.equal(buffer.toString(), 'yo', 'should return a clone of this instance');
    test.done();
  },
  '#pipe': function (test) {
    test.expect(1);
    var buffer = new DataPipe('path', 'utf8', 'dude');
    var reverse = function(input) {
      var reversed = input.toString().split("").reverse().join("");
      return input.content(reversed);
    };
    buffer.pipe(reverse).then(function (self) {
      test.equal(self.toString(), 'edud', 'should allow methods to transform buffer');
      test.done();
    });
  },
  '#extend': function (test) {
    test.expect(1);
    var Extended = DataPipe.extend({property:'set'});
    var ext = new Extended('blah');
    test.equal(ext.property, 'set', 'should create new constructor with properties added to prototype');
    test.done();
  }
};
