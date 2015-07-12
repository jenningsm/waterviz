
var responsive = require('../responsive.js')
var sel = require('../utils/sel.js')
var colors = require('../colors.js').colorStrings
var el = require('../utils/el.js')
var stys = require('../styles.js')
var sty = stys.style
var fonts = require('../fonts.js').fonts
var svgGen = require('../svg.js')

module.exports = function(){
  var box = el('div').style(
    sty('width', '100%'),
    sty('position', 'relative'),
    //sty('background', 'beige')
    sty('background', colors.secondary)
  )
  .content(
    whole()
  )

  responsive(box, sty('height', '90%'), sty('height', '70%'))

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
  var cat = el('categories', {
    'domain' : side === 'left' ? 'domestic' : 'agricultural'
  }).style(
    sty('margin', '.7em'),
    sty('font-size', '1.3em'),
    sty('position', 'absolute'),
    sty('z-index', '1'),
    sty(side, '0')
  )

  var big = stys.merge(
    sty('height', '100%'),
    stys.flex('column', 'flex-start', 'flex-' + (side === 'left' ? 'start' : 'end'))
  )

  var small = stys.merge(
    sty((side === 'left' ? 'top' : 'bottom'), 0),
    sty('width', '80%'),
    stys.flex('row' + (side === 'right' ? '-reverse' : ''), 'flex-start', 'flex-end'),
    sty('flex-wrap', 'wrap')
  )

  responsive(cat, small, big)

  cat.assign(sel('$ > *').style(sty('margin', '.05em .25em')), [0])

  return cat
}
