
module.exports.font = function(font, size){

  var ret = {}
  ret['font-family'] = font.name
  ret['font-weight'] = font.weight

  if(font.color !== undefined)
    ret['color'] = font.color

  if(font.size !== undefined)
    ret['font-size'] = font.size

  if(size !== undefined)
    ret['font-size'] = size

  return ret
}

module.exports.style = function(style, value){
  var ret = {}
  ret[style] = value
  return ret
}

module.exports.dims = dims
function dims(width, height){
  var ret = { 'width' : width }
  if(height !== undefined)
    ret['height'] = height

  return ret
}

module.exports.background = background
function background(img, position, brightness){
  var ret = {
    'background' : 'url(../media/' + img + ')',
    'background-size' : 'cover'
  }
  if(position === undefined)
    position = ['50%', '50%']

  ret['background-position'] = position[0] + ' ' + position[1]

  if(brightness !== undefined)
    ret['filter'] = 'brightness(' + brightness + ')'

  return ret
}

module.exports.flex = function(dir, justify, align){
  var ret = {
    'display' : 'flex',
    'flex-direction' : dir
  }
  if(justify !== undefined)
    ret['justify-content'] = justify
  if(align !== undefined)
    ret['align-items'] = align

  return ret
}
