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

var DataPipe = module.exports = function (source, encoding, input) {
  this.source = source;
  this.encoding = encoding;
  if (input) {
    Buffer.call(this, input);
  }
};
util.inherits(DataPipe, Buffer);

DataPipe.prototype.content = function (input) {
  if(!Buffer.isBuffer(input)) {
    Buffer.call(this, input, this.encoding);
  }
  Buffer.call(this, input);
  return this;
};

DataPipe.prototype.toString = function (encoding) {
  if(this.length === undefined) {
    return null;
  }
  if(!encoding) {
    encoding = this.encoding;
  }
  return Buffer.prototype.toString.call(this, encoding);
};

DataPipe.prototype.clone = function () {
  var replace = new this.constructor(this.source, this.encoding, this.length);
  if(this.length !== undefined) {
    this.copy(replace);
  }
  return replace;
};

DataPipe.prototype.pipe = function (method) {
  return this.load().then(function(self){return self.clone();}).then(method);
};

DataPipe.prototype.load = function () { return when(this); };
DataPipe.prototype.save = function () { return when(this); };

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