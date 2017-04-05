"use strict";

const { Wit, log } = require('node-wit'),
  async = require('async');

var moment = require('moment');

const config = require('config');

function NLPHandler() {

  const logApi = (process.env.LOG_API) ?
    (process.env.LOG_API) :
    config.get('logAPI');
  const accessToken = (process.env.WIT_ACCESS_TOKEN) ?
    (process.env.WIT_ACCESS_TOKEN) :
    config.get('witAccessToken');

  this.conf = {
    log: logApi,
    client: new Wit({
      accessToken: accessToken,
    })
  };

}

NLPHandler.prototype.log = function () {
  if (this.conf.log) {
    console.log.apply(this, arguments);
  }
};

NLPHandler.prototype.error = function () {
  if (this.conf.log) {
    console.err.apply(this, arguments);
  }
};

NLPHandler.prototype.resolve = function (message, callback) {
  this.conf.client.message(message, {}).then((data) => {
    callback(null, data);
  }).catch((err) => {
    callback(err, null);
  })
};

NLPHandler.prototype.resolveDateTime = function (resp, callback) {
  var ret = null;
  if (resp && resp.entities && resp.entities.datetime && 0 < resp.entities.datetime.length) {
    var from, to = null;
    if (resp.entities.datetime[0].to) {
      from = moment(resp.entities.datetime[0].from.value);
      to = moment(resp.entities.datetime[0].to.value);
    } else {
      from = moment(resp.entities.datetime[0].value);
    }
    ret = {
      from: from,
      to: to
    }
  }
  async.nextTick(() => {
    callback(null, ret);
  });
};

NLPHandler.prototype.resolveAmount = function (resp, callback) {
  var ret = null;
  if (resp && resp.entities && resp.entities.amount_of_money && 0 < resp.entities.amount_of_money.length) {
    ret = {
      value: resp.entities.amount_of_money[0].value,
      unit: resp.entities.amount_of_money[0].unit
    }
  }
  async.nextTick(() => {
    callback(null, ret);
  });
};

NLPHandler.prototype.resolveNumber = function (resp, callback) {
  var ret = null;
  if (resp && resp.entities && resp.entities.number && 0 < resp.entities.number.length) {
    ret = {
      value: resp.entities.number[0].value
    }
  }
  async.nextTick(() => {
    callback(null, ret);
  });
};

NLPHandler.prototype.resolveEmail = function (resp, callback) {
  var ret = null;
  if (resp && resp.entities && resp.entities.email && 0 < resp.entities.email.length) {
    ret = {
      value: resp.entities.email[0].value
    }
  }
  async.nextTick(() => {
    callback(null, ret);
  });
};

module.exports.NLPHandler = NLPHandler;