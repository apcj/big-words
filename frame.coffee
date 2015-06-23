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
    svgString = xmlserializer.serializeToString(svg.node())
    svgString = svgString.replace(/href=/g, 'xlink:href=')
    svgString = svgString.replace('xmlns="http://www.w3.org/2000/svg"',
        'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"')
    fs.writeFileSync 'target/frames/frame' + (i + 100) + '.svg', svgString
    i++