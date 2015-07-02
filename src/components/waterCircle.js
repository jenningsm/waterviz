
var el = require('../utils/el.js')

module.exports = function(){
  return el('circle', {
    'ng-attr-cx' : '{{ center.x }}', 
    'ng-attr-cy' : '{{ center.y }}',
    'ng-attr-r' : '{{ mradius }}'
  })
}
