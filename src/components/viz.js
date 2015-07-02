
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
    stys.dims('100%', '100%')
  ).content(
    category('left'),
    el('graphic', {'leftv' : 'values.left', 'rightv' : 'values.right'})
    .style(
      stys.dims('100%', '100%'),
      sty('position', 'absolute')
    ),
    category('right')
  )
}

var catWidth = .1

function category(side){
  return el('categories', {
    'domain' : side === 'left' ? 'domestic' : 'agricultural'
  }).style(
    sty('height', '100%'),
    sty('width', (100 * catWidth) + "%"),
    sty('font-size', '1.3em'),
    stys.flex('column', 'flex-start', 'flex-' + (side === 'left' ? 'start' : 'end')),
    sty('position', 'absolute'),
    sty(side, '0'),
    sty('z-index', '1')
  )
}
