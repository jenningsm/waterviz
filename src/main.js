
var el = require('./utils/el.js')
var stys = require('./styles.js')
var font = require('./fonts.js')

var html = el('html', {'ng-app' : 'app'}).style(
  {'margin' : '0', 'padding' : '0'}
)

var body = el('body').style({
   'margin' : '0',
   'padding' : '0'
  },
  stys.font(font.fonts.main)
)

var scripts = [
// 'bower_components/angular/angular.js',
// 'js/directives.js',
// 'js/app.js'
]


html.content(
  require('./components/head.js')(['o.css'],font.fontLinks),
  body.content(
    require('./components/core.js')()
  ),
  require('./utils/scripts.js')(scripts)
)

//var viz = require('./components/viz.js')()

var pages = {
  'index' : html,
//  'water-viz' : viz
}

require('./utils/generate.js')(pages)
