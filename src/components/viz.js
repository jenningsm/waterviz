
var colors = require('../colors.js').colorStrings
var el = require('../utils/el.js')
var stys = require('../styles.js')
var sty = stys.style
var fonts = require('../fonts.js').fonts

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
    half('left'),
    half('right')
  )
}


var catWidth = .1

function half(side){

  var circleSpot = el('div').style(
    sty('height', '100%'),
    sty('width', ((1 - catWidth) * 100) + '%')
  ).content(
  )
  var categoriesSpot = el('categories', {
    'domain' : side === 'left' ? 'domestic' : 'agricultural'
  }).style(
    sty('height', '100%'),
    sty('width', (100 * catWidth) + "%"),
    sty('font-size', '1.3em'),
    stys.flex('column', 'flex-start', 'flex-' + (side === 'left' ? 'start' : 'end'))
  )

  var together = [categoriesSpot, circleSpot]
  var order = [together[side === 'right' ? 1 : 0], together[side ==='right' ? 0 : 1]]

  return el('div').style(
    sty('width', '50%'),
    stys.flex('row')
  ).content(
    order
  )

}
