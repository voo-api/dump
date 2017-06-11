var glob = require('glob')
var fs = require('fs')

var getDirectories = function (src, callback) {
    glob(src + '/**/*.json', callback);
};

var processPayload = function(data) {
    var payload = []
    data.result.data.items.forEach(item => {
        var itineraries = item.itinerariesBox
        console.log(Object.keys(itineraries.matchingInfoMap['_0_0']))
        var price = {
            base: itineraries.matchingInfoMap["_0_0"].itineraryTrackingInfo.emissionAdultPrice.amount,
            total: itineraries.matchingInfoMap["_0_0"].itineraryTrackingInfo.price[0].amount
        }
        itineraries.outboundRoutes.forEach(itemOR => {
            itineraries.inboundRoutes.forEach(itemIR => {
                var outboundSegment =  itemOR.segments[0]
                var inboundSegment =  itemIR.segments[0]
                var flight = {
                    provider: item.provider,
                    price: price,
                    outbound: {
                        departure: outboundSegment.departure.hour,
                        arrival: outboundSegment.arrival.hour
                    },
                    inbound: {
                        departure: inboundSegment.departure.hour,
                        arrival: inboundSegment.arrival.hour
                    }
                }
                payload.push(flight)
            })
        })
    })
    return payload
}

getDirectories('data', function (err, res) {
    if (err) {
        console.log('Error', err);
    } else {
        res.forEach(jsonFile => {
            var data = require("./" + jsonFile)
            fs.writeFileSync(jsonFile + ".filter", JSON.stringify(processPayload(data)), 'utf8');
        })
    }
});

