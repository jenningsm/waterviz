
var colors = require('../colors.js').colorStrings
var el = require('../utils/el.js')
var stys = require('../styles.js')
var sty = stys.style
var fonts = require('../fonts.js').fonts

module.exports = function(){

  var viz = require('./viz.js')()

  var title = el('div').style(
    sty('width', '100%'),
    sty('text-align', 'center'),
    sty('line-height', '1.5'),
    stys.font(fonts.main)
  )
  .content(
    el('span').style(
      sty('font-size', '5em'),
      sty('border-bottom', '1px solid ' + colors.grey)
    )
    .content(
      'Where the water goes'
    ),
    '<br/>',
    el('span').style(
      sty('font-size', '2em')
    )
    .content(
      'A comparison of domestic and agricultural water usage in California.'
    )
  )

  return el('div').content(
    title,
    //el('water-viz')
    viz
  )
}
