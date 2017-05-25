var webdriverio = require('webdriverio');
var program = require('commander');


let options = {};

program
  .version('0.0.1')
  .option('--from <city>', 'From')
  .option('--to <city>', 'To')
  .option('--from-date <date>', 'From')
  .option('--to-date <date>', 'To')
  .parse(process.argv);

if(!program.from && !program.to && !program['from-date'] && !program['to-date']){
  throw new Error('too few args. see --help')
}

provider = {
    name : "Decolar",
    url : (from, to, fromDate, toDate) => `http://www.decolar.com/shop/flights/results/roundtrip/${from}/${to}/${fromDate}/${toDate}/1/0/0`,
    container : ".results-cluster-container"
}

var url = provider.url(program.from, program.to, program.fromDate, program.toDate)
console.log(url)

webdriverio
    .remote(options)
    .init()
    .url(url)
    .pause(10000)
    .getHTML(provider.container).then((err, html) => {
        if (err) {
          console.error({"err" : err , on : "departure-flight", args : program.rawArgs});
        } else {
          console.log({ flight: { provider : provider, "departure" : html }});
        }
    })
