
var colors = require('../colors.js').colorStrings
var el = require('../utils/el.js')
var stys = require('../styles.js')
var sty = stys.style
var svgGen = require('../svg.js')

module.exports = function(){
  var box = svgGen('100%', '100%', 'blue') 
  box().style(
    sty('position', 'absolute')
  )

  box('{{.33 }}', '{{ .5 }}','{{ leftSize }}')
  box('{{.67 }}', '{{ .5 }}', '{{ rightSize  }}')

  return box()
}
