var glob = require('glob')
var fs = require('fs')

var getDirectories = function (src, callback) {
    glob(src + '/**/*.json', callback);
};

var processPayload = function(data) {
    return data;
}

getDirectories('data', function (err, res) {
    if (err) {
        console.log('Error', err);
    } else {
        res.forEach(jsonFile => {
            var data = require("./" + jsonFile)
            fs.writeFileSync(jsonFile + ".filter", JSON.stringify(processPayload(data)), 'utf8');
        })
    }
});

