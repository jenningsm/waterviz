
var el = require('../utils/el.js')

module.exports = function(){

  return el('span', {
    'ng-style' : "{'color' : $parent.color(category.index)}",
    'ng-click' : '$parent.setCurrent(category.index)'
  })
  .content(
    '{{ category.name }}'
  )

}
