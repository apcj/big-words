var jsdom = require('jsdom');
var fs = require('fs');
var xmlserializer = require('xmlserializer');

function localFileUri(path) {
    return 'file://' + __dirname + path;
}

jsdom.env(
    "<html><body></body></html>",
    [
        localFileUri('/lib/d3.js'),
        localFileUri('/_site/init_neo.js'),
        localFileUri('/_site/straightArrow.js'),
        localFileUri('/_site/arcArrow.js'),
        localFileUri('/_site/london.js')
    ],
    function (err, window) {
        var svg = window.d3.select("body")
            .append("svg");

        for (var i = 0; i < 25; i++) {
            window.render(window.generateGraph(i * 40), svg);
            fs.writeFileSync('frame' + (i + 100) + '.svg', xmlserializer.serializeToString(svg.node()));
        }
    }
);