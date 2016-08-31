let proxies = require('proxy-lists');
const ping = require('node-http-ping');
let proxyURIs = []

let toProxyURI = (proxy) => {
	return "" + proxy.protocols[0] + '://' + proxy.ipAddress + ":" + proxy.port + "/" 
}

exports.load = (cb) => {
	proxies.getProxies({countries: ['br']}) //
	.on('data', (data) => {
		if (proxyURIs.length < 50) {
			console.log(`Loading more ${data.length} proxies ...`)
			data.forEach(element => {
				var pingDone = false
				ping(element.ipAddress, element.port)
					.then(time => {
						if (proxyURIs.length < 50) { 
							console.log(`Proxy healthy and loaded`)
							proxyURIs.push(toProxyURI(element))
						} 
					})
					.catch(err => console.error("Error"))					
			})
		}			
	})	
	.on('error', (data) => {
		console.error(`Error loading more proxies ...`)
		console.error(data)			
	})
	.once('end', () => {	
		console.log(`Loaded ${proxyURIs.length} proxies`)				
		proxyURIs.push(null)
		cb(proxyURIs)			
	})
}