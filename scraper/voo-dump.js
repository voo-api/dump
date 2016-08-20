const request = require('./proxy/request'),
      loader = require('./proxy/loader')
      moment = require("moment");

provider = {
    name : "Decolar",
    destinations: ["poa", "rio", "fln", "bsb", "sao", "bhz"],
    flights : () => {      
      let flightsAcc = []
      for (var m = moment().add(60, 'days'); m.isAfter(moment()); m.subtract(1, 'days')) {
        provider.destinations.forEach((elm) => {
          provider.destinations.forEach((sec_elm) => {
            if (elm != sec_elm) {
              flightsAcc.push({from: elm, to: sec_elm, date : m.format("YYYY-MM-DD")});      
            }
          })
        })
      }
      console.log(`Getting info for ${flightsAcc.length} flights`)
      return flightsAcc
    },
    url : (flight) => `http://www.decolar.com/shop/flights/data/search/oneway/${flight.from}/${flight.to}/${flight.date}/1/0/0/FARE/ASCENDING/NA/NA/NA/NA?itemType=SINGLETYPE&pageSize=1000&tripType=MULTIPLEONEWAY&resultsInstanceIndex=1`,   
}


loader.load((proxyURIs) => {
  provider.flights()    
    .forEach( (flight, index) => {      
      setTimeout(() => {
        request.toProxiedRequest(proxyURIs, provider.url(flight), 
          (data) => { 
            console.log({flight: { query: flight, provider : provider.name, result : data }, url : provider.url(flight), _meta : { time : new Date() }})
          },
          (err) => {
            console.error({err: err.message});
          })
        }, (index + 1) * 2500)
  })  
})
