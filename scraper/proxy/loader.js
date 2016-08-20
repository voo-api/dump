let proxies = require('proxy-lists');
let proxyURIs = []

let toProxyURI = (proxies) => {
	return proxies.map((element) => "" + element.protocols[0] + '://' + element.ipAddress + ":" + element.port + "/" )
}

exports.load = (cb) => {
	proxies.getProxies({anonymityLevels: ['elite'], countries: ['br']})
	.on('data', (data) => {
		console.log(`Loading more ${data.length} proxies ...`)			
		proxyURIs = proxyURIs.concat(toProxyURI(data))
	})	
	.on('error', (data) => {
		console.error(`Error loading more proxies ...`)
		console.error(data)			
	})
	.once('end', () => {	
		console.log(`Loaded ${proxyURIs.length} proxies`)
		cb(proxyURIs)			
	})
}