const proxies = require('proxy-lists'),
      Promise = require('bluebird'),
      rp = require("request-promise");

let proxyURIs = []
let proxiesLoaded = false

proxies.getProxies({ countries: ['br', 'us'] })
	.on('data', (data) => {
		proxyURIs = proxyURIs.concat(toProxyURI(data))
	})
	.once('end', () => {	
		proxiesLoaded = true		
	})


let proxiedReq = (url, proxy) => rp({ url : url, proxy: proxy, timeout: 5000 });
let toProxyURI = (proxies) => {
	proxies.map((element) => {
		return "" + element.protocols[0] + '://' + element.ipAddress + ":" + element.port + "/" 
	})
}

let hitEveryOne = (proxyURIs, url, cb, errcb) => {
  Promise.some(proxyURIs.map((proxy) => proxiedReq(url, proxy)), 3)
    .then(cb)
    .catch(Promise.AggregateError, function(err) {
		errcb(err)    		    	
    });	
}

exports.toProxiedRequest = (url, cb, err) => {
	while(!proxiesLoaded)
	hitEveryOne(proxyURIs, url, cb, err)	  
}
