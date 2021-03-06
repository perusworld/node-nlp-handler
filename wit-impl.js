"use strict";

const { Wit, log } = require('node-wit'),
  async = require('async');

var moment = require('moment');
var HttpsProxyAgent = require('https-proxy-agent');

function NLPHandler(config) {

  const logApi = (process.env.LOG_API) ?
    (process.env.LOG_API) :
    config.logAPI;
  const accessToken = (process.env.WIT_ACCESS_TOKEN) ?
    (process.env.WIT_ACCESS_TOKEN) :
    config.witAccessToken;
  const httpProxy = (process.env.HTTP_PROXY) ?
    (process.env.HTTP_PROXY) :
    config.httpProxy;

  var opts = {
    accessToken: accessToken
  };
  if (httpProxy && "" !== httpProxy) {
    console.log('using proxy', httpProxy)
    opts.agent = new HttpsProxyAgent(httpProxy);
  }
  this.conf = {
    log: logApi,
    client: new Wit(opts)
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

NLPHandler.prototype.resolveAmount = function (resp, callback, fallbackToNumber) {
  var ret = null;
  if (resp && resp.entities && resp.entities.amount_of_money && 0 < resp.entities.amount_of_money.length) {
    ret = {
      value: resp.entities.amount_of_money[0].value,
      unit: resp.entities.amount_of_money[0].unit
    }
  }
  if (!ret && fallbackToNumber) {
    ret = this.resolveNumber(resp);
  }
  if (callback) {
    async.nextTick(() => {
      callback(null, ret);
    });
  } else {
    return ret;
  }
};

NLPHandler.prototype.resolveNumber = function (resp, callback) {
  var ret = null;
  if (resp && resp.entities && resp.entities.number && 0 < resp.entities.number.length) {
    ret = {
      value: resp.entities.number[0].value
    }
  }
  if (callback) {
    async.nextTick(() => {
      callback(null, ret);
    });
  } else {
    return ret;
  }
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