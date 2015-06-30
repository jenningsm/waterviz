var el = require('../utils/el.js')

module.exports = function(stylesheets, fonts){
  var head = el('head')
  Object.keys(fonts).forEach(function(fontName){
    head.content(gFont(fontName, fonts[fontName]))
  })
  stylesheets.forEach(function(stylesheet){
    head.content(
      el('link/', {
        'rel' : 'stylesheet',
        'type' : 'text/css',
        'href' : 'css/' + stylesheet
      })
    )
  })

  head.content(
    el('title').content('title here'),
    el("meta/", {
      'name' : 'viewport',
      'content' : 'width=device-width, initial-scale=1.0'
    })
  )
  return head.embedJS()
}

function gFont(font, weights){
  return el('link/', {
    'rel' : 'stylesheet',
    'type' : 'text/css',
    'href' : 'http://fonts.googleapis.com/css?family=' + 
              font.replace(' ','+') + ':' + weights.join(',')
  })
} 
