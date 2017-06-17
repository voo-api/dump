var converter = require('json-2-csv');
var glob = require('glob')
var fs = require('fs')

var getDirectories = function (src, callback) {
    glob(src + '/*.json', callback);
};

var flatten = (payload) => {
    return [].concat.apply([], payload)
}


exports.toHtml = function (csv) {
    var inlineCSV = csv.replace(/(?:\r\n|\r|\n)/g, '\\n');
    var template = fs.readFileSync('plot/index.html.template', 'utf8')
    return template.replace("################", inlineCSV)
}

exports.toCSV = function(cb) {
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
                    cb(csv)
                }
            }, {})

        }
    });
}




