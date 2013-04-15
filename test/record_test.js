var fs = require('fs');
var path = require('path');
var Record = require('../lib/record');
var when = require('when');

exports['Record'] = {
  'constructor': function (test) {
    test.expect(4);
    test.equal((new Record('test')).constructor, Record, 'should create a record instance');
    test.equal((new Record('test')).path, 'test', 'should save buffer source');
    test.equal((new Record('test', 'ascii')).encoding, 'ascii', 'should save encoding');
    test.equal((new Record('test','utf8','content')).toString(), 'content', 'should allow initialization with value');
    test.done();
  },
  '#content': function (test) {
    test.expect(2);
    test.equal((new Record('fake/path')).content('data').toString(), 'data', 'should populate buffer instance with string');
    test.equal((new Record('fake/path')).content(new Buffer('data')).toString(), 'data', 'should populate buffer instance with buffer');
    test.done();
  },
  '#append': function (test) {
    test.expect(2);
    test.equal((new Record('fake/path', 'utf8', 'test')).append('data').toString(), 'testdata', 'should allow appending data with strings');
    test.equal((new Record('fake/path', 'utf8', 'test')).append(new Buffer('data')).toString(), 'testdata', 'should allow appending data with buffers');
    test.done();
  },
  '#prepend': function (test) {
    test.expect(2);
    test.equal((new Record('fake/path', 'utf8', 'test')).prepend('data').toString(), 'datatest', 'should allow prepending data with strings');
    test.equal((new Record('fake/path', 'utf8', 'test')).prepend(new Buffer('data')).toString(), 'datatest', 'should allow prepending data with buffers');
    test.done();
  },
  '#toString': function (test) {
    test.expect(1);
    test.equal((new Record('fake/path')).toString(), null, 'should return null if buffer has not been populated yet');
    test.done();
  },
  '#clone': function (test) {
    test.expect(2);
    var record = new Record('path');
    record.content('yo');
    var copy = record.clone();
    test.equal(copy.toString(), 'yo', 'should return a clone of this instance');
    copy.content('changed');
    test.equal(record.toString(), 'yo', 'should return a clone of this instance');
    test.done();
  },
  '#pipe': function (test) {
    test.expect(1);
    var record =  new Record('path', 'utf8', 'dude');
    var reverse = function(input) {
      var reversed = input.toString().split("").reverse().join("");
      return input.content(reversed);
    };
    record.pipe(reverse).then(function (self) {
      test.equal(self.toString(), 'edud', 'should allow methods to transform buffer');
      test.done();
    });
  }
};
