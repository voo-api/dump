const localproxies = require('./local-proxies'),
      Promise = require('bluebird'),
      rp = require("request-promise")

let options = {};

provider = {
    name : "Decolar",
    url : (from, to, date) => `http://www.decolar.com/shop/flights/data/search/oneway/${from}/${to}/${date}/1/0/0/FARE/ASCENDING/NA/NA/NA/NA?itemType=SINGLETYPE&pageSize=1000&tripType=MULTIPLEONEWAY&resultsInstanceIndex=1`,   
}

let proxiedReq = (url, proxy) => {
  return rp({
        url : url,
        proxy: proxy,
        timeout: 3000
      })
}

localproxies.loadproxies((proxies) => {
  let requests = proxies.map((elm) => proxiedReq(provider.url("poa", "rio" , "2016-10-11"), elm))
  Promise.some(requests, 1)
    .then(function (data) {
      console.log({ flight: { provider : provider, "departure" : data }});    
    })
    .catch(Promise.AggregateError, function(err) {
    });
})

// webdriverio    
//     .remote(options)
//     .init()
//     .url(provider.url(program.from, program.to, program.fromDate, program.toDate))    
//     .getHTML(provider.container).then((err, html) => {
//         if (err) {
//           console.error({"err" : err , on : "departure-flight", args : program.rawArgs});
//         } else {
//           console.log({ flight: { provider : provider, "departure" : html }});
//         }
//     })
//     .click('.arrival-item')
//     .getHTML(provider.container).then((err, html) => {
//         if (err) {
//           console.error({"err" : err , on : "arrival-flight", args : program.rawArgs});
//         } else {
//           console.log({ flight: { provider : provider, "arrival" : html }});
//         }
//     })