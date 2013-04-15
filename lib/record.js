/*
 * record
 * http://github.com/node-task/record
 *
 * Copyright (c) 2013 Tyler Kellen, contributors
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');
var when = require('when');

var Record = function Record(source, encoding, input) {
  this.source = source;
  this.encoding = encoding;
  this.buffer = null;
  if(input) {
    this.content(input);
  }
};

Record.prototype.inspect = function() {
  var inspect = this.source;
  if (this.buffer) {
    inspect += ' '+this.buffer.inspect();
  }
  return '<Record "'+inspect+'">';
};

Record.prototype.content = function (input) {
  if(!Buffer.isBuffer(input)) {
    this.buffer = new Buffer(input, this.encoding);
  } else {
    this.buffer = input;
  }
  return this;
};

Record.prototype.append = function (input) {
  if(!Buffer.isBuffer(input)) {
    input = new Buffer(input, this.encoding);
  }
  return this.content(Buffer.concat([this.buffer, input]));
};

Record.prototype.prepend = function (input) {
  if(!Buffer.isBuffer(input)) {
    input = new Buffer(input, this.encoding);
  }
  return this.content(Buffer.concat([input, this.buffer]));
};

Record.prototype.toString = function (encoding) {
  if(this.buffer === null) {
    return null;
  }
  if(!encoding) {
    encoding = this.encoding;
  }
  return this.buffer.toString(encoding);
};

Record.prototype.clone = function () {
  var replace = new this.constructor(this.source, this.encoding);
  if(this.buffer !== null) {
    replace.buffer = new Buffer(this.buffer.length);
    this.buffer.copy(replace.buffer);
  }
  return replace;
};

Record.prototype.pipe = function (method) {
  return when(method(this.clone()));
};

module.exports = Record;