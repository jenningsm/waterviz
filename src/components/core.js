
var colors = require('../colors.js').colorStrings
var el = require('../utils/el.js')
var stys = require('../styles.js')
var sty = stys.style
var fonts = require('../fonts.js').fonts

module.exports = function(){
  var title =  el('div').style(
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
    ),
    el('div').style(
      sty('width', '80%'),
      sty('font-size', '1.25em'),
      sty('margin', '1em auto')
    )
    .content(
      'With the current drought in California, a lot is made of reducing domestic \
       water consumption, but what about agricultural consumption? How does water \
       use in the fields compare to water use in the home? See for yourself: Select \
       a category of domestic water consumption on the left and of agricultural \
       consumption on the right, and see how much water is used on each across California.'
    )
  )

  return el('div').content(
    title,
    el('water-viz'),
    el('div').style(stys.dims('100%', '100px'))
  )
}
