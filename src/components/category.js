
var el = require('../utils/el.js')

module.exports = function(){

  return el('span', {
    'ng-style' : "{'color' : $parent.color(category)}",
    'ng-click' : '$parent.setCurrent(category)'
  })
  .content(
    '{{ category.name }}'
  )

}
