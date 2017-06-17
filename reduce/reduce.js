var glob = require('glob')
var moment = require('moment')
var fs = require('fs')

var getDirectories = function (src, callback) {
    glob(src + '/*/*/*.json', callback);
};

var weekendHash = function(start, end) {
    var saturday = moment(start).isoWeekday(6).dayOfYear()
    var sunday = moment(start).isoWeekday(7).dayOfYear()
    return new Buffer(`${saturday}/${sunday}`).toString('base64')
}

var routeTimeFilter = (item => {
    var outboundTime = moment(item.outbound.departure.raw)
    var inboundTime = moment(item.inbound.departure.raw)

    var outboundTargetMorningTime = outboundTime.clone().hour(13)
    var inboundTargetMorningTime = inboundTime.clone().hour(13)

    var outboundTargetNightTime = outboundTime.clone().hour(21)
    var inboundTargetNightTime = inboundTime.clone().hour(21)
    return (outboundTime.isBefore(outboundTargetMorningTime) || outboundTime.isAfter(outboundTargetNightTime)) &&
            (inboundTime.isBefore(inboundTargetMorningTime) || inboundTime.isAfter(inboundTargetNightTime))
})

var reduce = (results) => {
    return results.filter(routeTimeFilter)
}

var processPayload = function(data) {
    var payload = []
    if (data.result.data.items) {
        data.result.data.items.forEach(item => {
            var itineraries = item.itinerariesBox
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
    }
    return payload
}

var extractMeta = (jsonFile) => {
    var r  = jsonFile.match(new RegExp('data/(.*)/(.*)/flight-(.*).json'));
    var startDate = r[1]
    var endDate = r[2]
    var queryTimestamp = r[3]
    return {
        between: {
            start: startDate,
            end: endDate
        },
        weekend: weekendHash(startDate, endDate),
        query: queryTimestamp
    }
}

getDirectories('data', function (err, res) {
    if (err) {
        console.log('Error', err);
    } else {
        var payloads = res.map(jsonFile => {
            return {
                meta : extractMeta(jsonFile),
                data: reduce(processPayload(require("./" + jsonFile)))
            }
        })

        fs.writeFileSync(`reduced/flights-reduced-${ new Date().toISOString() }.json`, JSON.stringify(payloads), 'utf8');
    }
});

