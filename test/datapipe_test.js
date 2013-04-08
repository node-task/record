var fs = require('fs');
var path = require('path');
var DataPipe = require('../lib/datapipe');

exports['DataPipe'] = {
  'constructor': function (test) {
    test.expect(4);
    test.equal((new DataPipe('test')).constructor, DataPipe, 'should create a datapipe instance');
    test.equal((new DataPipe('test')).source, 'test', 'should save buffer source');
    test.equal((new DataPipe('test')).encoding, 'utf8', 'should default to utf8 encoding');
    test.equal((new DataPipe('test', 'ascii')).encoding, 'ascii', 'should save encoding');
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
  '#extend': function(test) {
    test.expect(1);
    var Extended = DataPipe.extend({property:'set'});
    var ext = new Extended('blah');
    test.equal(ext.property, 'set', 'should create new constructor with properties added to prototype');
    test.done();
  }
};
