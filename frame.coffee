jsdom = require('jsdom')
fs = require('fs')
xmlserializer = require('xmlserializer')

localFileUri = (path) ->
  'file://' + __dirname + path

jsdom.env '<html><body></body></html>', [
  localFileUri('/lib/d3.js')
  localFileUri('/init_neo.js')
  localFileUri('/straightArrow.js')
  localFileUri('/arcArrow.js')
  localFileUri('/london.js')
], (err, window) ->
  svg = window.d3.select('body').append('svg')
  for i in [0..24]
    window.render window.generateGraph(i * 40), svg
    fs.writeFileSync 'target/frames/frame' + i + 100 + '.svg', xmlserializer.serializeToString(svg.node())
    i++