
var colors = require('../colors.js').colorStrings
var el = require('../utils/el.js')
var stys = require('../styles.js')
var sty = stys.style
var svgGen = require('../svg.js')

module.exports = function(){
  var box = svgGen('100%', '100%', 'blue', 2) 
  box.style(
    sty('position', 'absolute')
  )

  return box
}
