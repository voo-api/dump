const localproxies = require('./local-proxies'),
      moment = require("moment");

provider = {
    name : "Decolar",
    destinations: ["poa", "rio"],
    flights : () => {
      let flightsAcc = []
      for (var m = moment().add(60, 'days'); m.isAfter(moment()); m.subtract(1, 'days')) {
        flightsAcc.push({from: provider.destinations[0], to: provider.destinations[1], date : m.format("YYYY-MM-DD")});
        flightsAcc.push({from: provider.destinations[1], to: provider.destinations[0], date : m.format("YYYY-MM-DD")});
      }
      return flightsAcc
    },
    url : (flight) => `http://www.decolar.com/shop/flights/data/search/oneway/${flight.from}/${flight.to}/${flight.date}/1/0/0/FARE/ASCENDING/NA/NA/NA/NA?itemType=SINGLETYPE&pageSize=1000&tripType=MULTIPLEONEWAY&resultsInstanceIndex=1`,   
}

provider.flights().map(f => provider.url(f)).forEach(url => {
  localproxies.toProxiedRequest(url, 
  (data) => {
    console.log({flight: { provider : provider.name, result : data }, url : url});
  },
  (err) => {
    console.error({err: err});
  })
})