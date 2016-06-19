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

source = {
    name : "Decolar",
    url : function(from, to, fromDate, toDate) {
      return `http://www.decolar.com/shop/flights/results/multipleoneway/${from}/${to}/${fromDate}/${toDate}/1/0/0`
    },
    container : ".flights-cluster"
}


webdriverio
    .remote(options)
    .init()
    .url(source.url(program.from, program.to, program.fromDate, program.toDate))
    .pause(20000)
    .getHTML(source.container).then(function(err, html) {
        if (err) {
          console.error({"err" : err , on : "departure-flight", args : program.rawArgs});
        } else {
          console.log({ "departure-flight" : html });
        }
    })
    .click('.arrival-item')
    .pause(20000)
    .getHTML(source.container).then(function(err, html) {
        if (err) {
          console.error({"err" : err , on : "arrival-flight", args : program.rawArgs});
        } else {
          console.log({ "arrival-flight" : html });
        }
    })
    .close()
