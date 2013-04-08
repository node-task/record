/*
 * node-datapipe
 * http://github.com/tkellen/node-datapipe
 *
 * Copyright (c) 2013 Tyler Kellen, contributors
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');
var when = require('when');

var DataPipe = module.exports = function (source, encoding) {
  if(!encoding) {
    encoding = 'utf8';
  }
  this.source = source;
  this.encoding = encoding;
  this.buffer = null;
};

DataPipe.prototype.content = function (input) {
  if(!Buffer.isBuffer(input)) {
    input = new Buffer(input, this.encoding);
  }
  this.buffer = input;
  return this;
};

DataPipe.prototype.toString = function (encoding) {
  if(this.buffer === null) {
    return null;
  }
  if(!encoding) {
    encoding = this.encoding;
  }
  return Buffer.prototype.toString.call(this.buffer, encoding);
};

DataPipe.prototype.read = function () {
  throw new Error('Please implement a read method.');
};

DataPipe.prototype.write = function () {
  throw new Error('Please implement a write method.');
};

DataPipe.prototype.clone = function () {
  var replacement = new this.constructor(this.source, this.encoding);
  if(this.buffer !== null) {
    replacement.buffer = new Buffer(this.buffer.length, this.encoding);
    this.buffer.copy(replacement.buffer);
  }
  return replacement;
};

DataPipe.prototype.pipe = function (method) {
  return when(this.read()).then(this.clone()).then(method);
};

DataPipe.extend = function(props) {
  var ctor = function ()  {
    DataPipe.apply(this, arguments);
  };
  util.inherits(ctor, DataPipe);
  for (var prop in props) {
    if(props.hasOwnProperty(prop)) {
      ctor.prototype[prop] = props[prop];
    }
  }
  return ctor;
};