/*
 * datapipe
 * http://github.com/node-task/datapipe
 *
 * Copyright (c) 2013 Tyler Kellen, contributors
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');
var when = require('when');

var DataPipe = function DataPipe(source, encoding, input) {
  this.source = source;
  this.encoding = encoding;
  this.buffer = null;
  if(input) {
    this.content(input);
  }
};
util.inherits(DataPipe, Buffer);

DataPipe.prototype.inspect = function() {
  return "<DataPipe "+this.source+">";
};

DataPipe.prototype.content = function (input) {
  if(!Buffer.isBuffer(input)) {
    this.buffer = new Buffer(input, this.encoding);
  } else {
    this.buffer = input;
  }
  return this;
};

DataPipe.prototype.toString = function (encoding) {
  if(this.buffer === null) {
    return null;
  }
  if(!encoding) {
    encoding = this.encoding;
  }
  return this.buffer.toString(encoding);
};

DataPipe.prototype.clone = function () {
  var replace = new this.constructor(this.source, this.encoding);
  if(this.buffer !== null) {
    replace.buffer = new Buffer(this.buffer.length);
    this.buffer.copy(replace.buffer);
  }
  return replace;
};

DataPipe.prototype.pipe = function (method) {
  return this.read().then(function(self){return self.clone();}).then(method);
};

DataPipe.prototype.read = function () { return when(this); };
DataPipe.prototype.write = function () { return when(this); };

DataPipe.extend = function(props) {
  var ctor = function BufferedInput()  {
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

module.exports = DataPipe;