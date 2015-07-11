
var el = require('../utils/el.js')
var sty = require('../styles.js').style

module.exports = function(){

  return el('span', {
    'ng-style' : "{'color' : $parent.color(category), 'font-size' : $parent.size(category)}",
    'ng-click' : '$parent.setCurrent(category)'
  })
  .style(
    sty('cursor', 'pointer'),
    sty('transition', 'font-size .5s')
  )
  .content(
    '{{ category.name | lowercase }}'
  )

}
