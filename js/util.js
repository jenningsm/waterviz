
function shallowCopy(o){
  var ret
  if(Array.isArray(o)){
    ret =  o.slice(0)
  } else if(typeof o === 'object'){
    ret = {}
    Object.keys(o).forEach(function(key){
      ret[key] = o[key]
    })
    return ret
  } else {
    ret = o
  }
  return ret
}
