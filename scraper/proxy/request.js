let Promise = require('bluebird'),
    rp = require("request-promise");

let proxiedReq = (url, proxy) => rp({ url : url, proxy: proxy, timeout: 10000 });
let hitEveryOne = (proxyURIs, url, cb, errcb) => {
  Promise.some(proxyURIs.map((proxy) => proxiedReq(url, proxy)), 1)
    .then(cb)
    .catch(Promise.AggregateError, function(err) {
		errcb(err)    		    	
    });	
}

exports.toProxiedRequest = (proxyURIs, url, cb, err) => {
	hitEveryOne(proxyURIs, url, cb, err)	  
}
