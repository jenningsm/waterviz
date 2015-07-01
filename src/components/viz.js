
var colors = require('../colors.js').colorStrings
var el = require('../utils/el.js')
var stys = require('../styles.js')
var sty = stys.style
var fonts = require('../fonts.js').fonts
var svgGen = require('../svg.js')

module.exports = function(){
  var box = el('div').style(
    sty('width', '100%'),
    sty('height', '50%'),
    sty('position', 'relative'),
    sty('background', 'beige')
  )
  .content(
    whole()
  )

  return box
}

function whole(){
  return el('div').style(
    stys.dims('100%', '100%'),
    stys.flex('row')
  ).content(
    category('left'),
    center(),
    category('right')
  )
}


var catWidth = .1

function center(){
  var box = svgGen(((1 - 2 * catWidth) * 100) + '%', '100%', 'blue') 
  box().style(
    sty('height', '100%'),
    sty('width', ((1 - catWidth) * 100) + '%')
  )

  box(.25, .5, .1).attribute('id', 'left-circle')
  box(.75, .5, .05).attribute('id', 'right-circle')
  return box()
}

function category(side){
  return el('categories', {
    'domain' : side === 'left' ? 'domestic' : 'agricultural'
  }).style(
    sty('height', '100%'),
    sty('width', (100 * catWidth) + "%"),
    sty('font-size', '1.3em'),
    stys.flex('column', 'flex-start', 'flex-' + (side === 'left' ? 'start' : 'end'))
  )
}
