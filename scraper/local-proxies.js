const proxies = require('proxy-lists')


exports.loadproxies = function (cb) {
	let proxiesArray = []
	let alreadyReturned = false
	proxies.getProxies({ countries: ['br'] })
	.on('data', (data) => {
		proxiesArray = proxiesArray.concat(data)
	})
	.once('end', () => {
		if (!alreadyReturned) {
			cb(proxiesArray.map((element) => {
			  return "" + element.protocols[0] + '://' + element.ipAddress + ":" + element.port + "/" 
			}))
		}
	})
}