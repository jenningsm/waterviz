
var app = angular.module('app', ['directives']);


app.factory('Links', ['$http', function($http){

  var linkInfo = $http.get('data/links.json').then(function(data){
    return data.data
  })
  
  function getField(info, field, index){
    if(Array.isArray(field))
      field = field[index]

    if(field.charAt(0) === '#')
      return field.slice(1)
    return info[field]
  }

  return {
    getLinks : function(links) { 
      return linkInfo.then(function(linki){
        var ret = []
        for(var i = 0; i < links.entities.length; i++){
          var entry = linki[links.entities[i]]
          var link = {
            'title' : getField(entry, links.format.title, i),
            'subtitle' : getField(entry, links.format.subtitle, i),
            'img' : entry.img,
            'path' : entry.path
          }
          ret.push(link)
        }
        return ret
      })
    }
  }

}])

app.controller('ContentController', ['$scope', '$http', '$routeParams', '$sce', 'Links',
  function($scope, $http, $routeParams, $sce, links){
    if($routeParams.page === undefined)
      $routeParams.page = 'front'
    $http.get('data/' + $routeParams.page + '.json').success(function(data){
      if(data.content !== undefined){
        $scope.content = $sce.trustAsHtml(data.content)
        data.content = undefined
      }
      if(data.links !== undefined){
        links.getLinks(data.links).then(function(data){
          $scope.links = data
          data.links = undefined
        })
      }
      var keys = Object.keys(data)
      for(var i = 0; i < keys.length; i++){
        if(data[keys[i]] !== undefined){
          $scope[keys[i]] = data[keys[i]]
        }
      }
    })
  }
])

app.controller('LinkController', ['$scope', '$location', function($scope, $location){
  $scope.goto = function(path){
    $location.path(path)
  }
}])
