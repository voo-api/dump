var glob = require('glob')
var moment = require('moment')
var fs = require('fs')
var notify = require('./notify')

var getDirectories = function (src, callback) {
    glob(src + '/**/*.json', callback);
};



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
    return payload
}

getDirectories('data', function (err, res) {
    if (err) {
        console.log('Error', err);
    } else {
        res.forEach(jsonFile => {
            var r  = jsonFile.match(new RegExp('data/(.*)/(.*)/flight-(.*).json'));
            var data = reduce(processPayload(require("./" + jsonFile)))
            var payload = {
                meta : {
                    startDate: r[1],
                    endDate: r[2],
                    collectTimestamp: r[3]
                },
                data: data
            }

            fs.writeFileSync(jsonFile + ".filter", JSON.stringify(payload), 'utf8');
        })

        var attch = res.map(f => f + ".filter").map(f => {
            //return { filename: f.split("/").slice(-1)[0], path: f }
            console.log(f)
            var obj = JSON.parse(fs.readFileSync(f, 'utf8'));
            return obj
        })
        let mailOptions = {
            from: 'vitor_btf@hotmail.com', // sender address
            to: 'vitor.tfreitas@gmail.com', // list of receivers
            subject: `Flight Report - ${new Date().toISOString()}`, // Subject line
            text: 'Flight Report',
            attachments: {
                filename: "report.json",
                content: JSON.stringify(attch)
            }
        };

        notify.send(mailOptions)
    }
});

