var converter = require('json-2-csv');
var fs = require('fs')
var glob = require('glob')

var getDirectories = function (src, callback) {
    glob(src + '/*.json', callback);
};

var flatten = (payload) => {
    return [].concat.apply([], payload)
}

getDirectories('reduced', function (err, res) {
    if (err) {
        console.log('Error', err);
    } else {
        var reducedPayloads = flatten(
            res.map(jsonFile => {
                var payload = require("./" + jsonFile)
                return payload
            })
        )

        var innerFlatPayloads = flatten(
            reducedPayloads.map( offer => {
                return offer.data.map( flight => {
                    flight.meta = offer.meta
                    return flight
                })
            })
        )

        converter.json2csv(innerFlatPayloads, (err, csv) => {
            if(err) {
                console.error(err)
            } else {
                fs.writeFileSync("flights-reduced.csv", csv, 'utf8');
            }
        }, {})

    }
});



