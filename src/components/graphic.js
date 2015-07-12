
var colors = require('../colors.js').colorStrings
var el = require('../utils/el.js')
var stys = require('../styles.js')
var sty = stys.style
var svgGen = require('../svg.js')

module.exports = function(){
  //var box = svgGen('100%', '100%', 'blue', 2) 
  var box = svgGen('100%', '100%', colors.primary, 2) 
  box.style(
    sty('position', 'absolute')
  )

  function textBox(){
    return el('div').style(
      sty('position', 'absolute'),
      sty('color', 'white')
    ).content(
      el('div').style(
        sty('transform', 'translate(-50%, -50%)'),
        sty('font-size', '1.3em'),
        sty('width', 'max-content'),
        sty('white-space', 'nowrap')
      )
      .content('text')
   )

  }

  var text = el('div').style(
    stys.dims('100%', '100%'),
    sty('position', 'absolute')
  ).content(
    textBox(),
    textBox()
  )

  return el().content(box, text)
}
