var nlpapi = require('../node-nlp-handler').nlphandler();

var nlphandler = new nlpapi.NLPHandler({
  "logAPI": false,
  "witAccessToken": ""
});

var text = "two hundred and fifty five";
nlphandler.resolve(text, (err, resp) => {
  if (err) {
    console.error(err);
  } else {
    console.dir(resp, { depth: null });
    nlphandler.resolveAmount(resp, (err, resp) => {
      if (err) {
        console.error(err);
      } else {
        console.log(resp);
      }
    }, true)
  }
})
