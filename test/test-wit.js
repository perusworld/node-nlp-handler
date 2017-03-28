var nlpapi = require('../node-nlp-handler').nlphandler();

var nlphandler = new nlpapi.NLPHandler();

var text = "send email to as.bs@as.com";
nlphandler.resolve(text, (err, resp) => {
  if (err) {
    console.error(err);
  } else {
    console.dir(resp, { depth: null });
    nlphandler.resolveEmail(resp, (err, resp) => {
      if (err) {
        console.error(err);
      } else {
        console.log(resp);
      }
    })
  }
})
