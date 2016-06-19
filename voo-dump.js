var webdriverio = require('webdriverio');
var program = require('commander');

var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};

program
  .version('0.0.1')
  .option('--from <cit>', 'From')
  .option('--to <city>', 'To')
  .option('--from-date <date>', 'From')
  .option('--to-date <date>', 'To')
  .parse(process.argv);

if(!program.from && !program.to && !program['from-date'] && !program['to-date']){
  throw new Error('too few args. see --help')
}

webdriverio
    .remote(options)
    .init()
    .url(`http://www.decolar.com/shop/flights/results/multipleoneway/${program.from}/${program.to}/${program.fromDate}/${program.toDate}/1/0/0`)
    .pause(20000)
    .getHTML('.flights-cluster').then(function(err, html) {
        if (err) {
          console.error({"err" : err , on : "to-flight", args : program.rawArgs});
        } else {
          console.log({ "to-flight" : html });
        }
    })
    .close()
