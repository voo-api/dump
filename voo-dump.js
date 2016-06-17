
var webdriverio = require('webdriverio');
var program = require('commander');

var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};


program
  .version('0.0.1')
  .option('-f, --from', 'From')
  .option('-t, --to', 'To')
  .parse(process.argv);


webdriverio
    .remote(options)
    .init()
    .url('http://www.decolar.com/shop/flights/results/multipleoneway/poa/rio/2016-06-24/2016-06-27/1/0/0')
    .pause(20000)
    .getHTML('.flights-cluster').then(function(err, html) {
        if (err) {
          throw new Error(err)
        } else {
          console.log({ "to" : html })
        }
    })
