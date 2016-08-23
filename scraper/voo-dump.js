const request = require('./proxy/request'),
      loader = require('./proxy/loader')
      moment = require("moment");

provider = {
    name : "Decolar",
    destinations: ["poa", "rio", "fln", "bsb", "sao", "bhz"],
    flights : () => {      
      let flightsAcc = []
      for (var m = moment().add(90, 'days'); m.isAfter(moment()); m.subtract(1, 'days')) {
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

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

let lastScheduledCall = 0
let sucessCounter = 0
loader.load((proxyURIs) => {
  shuffleArray(provider.flights())    
    .forEach( (flight, index) => {
      let scheduled = Math.floor((((index + 1)*(randomInt(2,100))) * 200) / randomInt(20,100))
      if (scheduled > lastScheduledCall) lastScheduledCall = scheduled;
      setTimeout(() => {
        request.toProxiedRequest(proxyURIs, provider.url(flight), 
          (data) => {
            data.forEach((elm) => {
              if (elm.trim().startsWith("{\"result\":")) {
                console.log({flight: { query: flight, provider : provider.name, result : data }, url : provider.url(flight), _meta : { time : new Date() }})
              }              
            })            
          },
          (err) => {
            console.error({err: err.message});
          })
        }, scheduled)
  })
  console.log(`Last call scheduled to ${lastScheduledCall} msecs`)       
})
