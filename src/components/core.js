
var colors = require('../colors.js').colorStrings
var el = require('../utils/el.js')
var stys = require('../styles.js')
var sty = stys.style
var fonts = require('../fonts.js').fonts

module.exports = function(){
  var title =  el('div').style(
    sty('width', '100%'),
    sty('text-align', 'center'),
    sty('line-height', '1.5')
  )
  .content(
    el('div').style(
      sty('font-size', '5em'),
      sty('width', 'fit-content'),
      sty('margin', '0 auto')
    )
    .content(
      'Where the Water Goes'
    ),
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

  var sources =  el('div').style(
    sty('width', '100%'),
    sty('text-align', 'center'),
    sty('line-height', '1.5')
  )
  .content(
    el('div').style(
      sty('font-size', '2.5em'),
      sty('width', 'fit-content'),
      sty('margin', '0 auto')
    )
    .content(
      'Sources'
    ),
    el('div').style(
      sty('width', '80%'),
      sty('font-size', '1.25em'),
      sty('margin', '1em auto')
    )
    .content(
      el('a', {'href' : 'http://pacinst.org/wp-content/uploads/sites/21/2015/04/CA-Ag-Water-Use.pdf'})
      .content('California Agricultural Water Use: Key Background Information'),
     ' by the Pacific Institute, and ',
     el('a', {'href' : 'http://www.irwd.com/images/pdf/save-water/CaSingleFamilyWaterUseEfficiencyStudyJune2011.pdf'})
     .content('California Single Family Water Use Efficiency Study'),
     ' by the Irvine Ranch Water District'
    )
   
  )

  function hr(){
    return el('hr/').style(
      sty('width', '75px'),
      sty('margin', '40px auto')
    )
  }

  return el('div').content(
    title,
    hr(),
    el('water-viz'),
    hr(),
    sources,
    hr()
  ).style(
    sty('min-width', '600px')
  )
}
