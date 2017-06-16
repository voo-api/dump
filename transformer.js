var payload = require('./flights-reduced.json')
var converter = require('json-2-csv');
var fs = require('fs')

payload = payload.map( offer => {
    return offer.data.map( flight => {
        flight.meta = offer.meta
        return flight
    })
})

var flatten = [].concat.apply([], payload);

converter.json2csv(flatten, (err, csv) => {
    if(err) {
        console.error(err)
    } else {
        console.log(csv)
        fs.writeFileSync("flights-reduced.csv", csv, 'utf8');
    }
}, {})
