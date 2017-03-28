var nlpapi = require('../node-nlp-handler').nlphandler();

var nlphandler = new nlpapi.NLPHandler();

var text = "tomorrow afternoon";
nlphandler.resolve(text, (err, resp) => {
  if (err) {
    console.error(err);
  } else {
    console.dir(resp, { depth: null });
    nlphandler.resolveDateTime(resp, (err, resp) => {
      if (err) {
        console.error(err);
      } else {
        console.log(resp);
      }
    })
  }
})
