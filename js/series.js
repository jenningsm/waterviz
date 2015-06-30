
var app = angular.module('series', ['ngRoute'])

app.factory('SeriesLinks', ['$http', 'Links', function($http, links){

  var series = {}

  //HARDCODED HACK; NEEDS TO BE FIXED
//  $http.get('data/series/beginnings/index.json').success(function(data){
//    series.beginnings = data.links
//  })

  function getLinks(page, sequence){
    function format(entities, title, subtitle){
      return {
        "format" : {
          "title" : title,
          "subtitle" : subtitle
        },
        "entities" : entities
      }
    }

    if(page === 'index')
      return links.getLinks(format(sequence, "title", "artist")).then(function(data){
        return {'links' : data}
      })

    for(var i = 0; i < sequence.length && sequence[i] !== page; i++);
    if(i === sequence.length){
      //ERROR
    } else {
      var entities = []
      if(i !== 0)
        entities.push(sequence[i-1])
      if(i !== sequence.length - 1)
        entities.push(sequence[i+1])

      var titles = []
      if(i !== 0)
        titles.push('#previous')
      if(i !== sequence.length -1)
        titles.push('#next')

      return links.getLinks(format(entities, titles, "title")).then(function(data){
        return {
          'links' : data,
          'side' : i % 2 === 0 ? 'right' : 'left'
        }
      })
    }
  }

  return {
    getLinks : function(seriesName, pageName){
      var ret = []
      if(series[seriesName] === undefined){
        series[seriesName] = $http.get('data/series/' + seriesName + '/index.json').then(function(data){
          return data.data.links
        })
      }
      return series[seriesName].then(function(links){
        return getLinks(pageName, links)
      })
    }
  }
}])

app.controller('SeriesController', ['$scope', '$http', '$routeParams', '$sce', 'SeriesLinks',
  function($scope, $http, $routeParams, $sce, links){
    if($routeParams.page === undefined)
      $routeParams.page = 'index'

    $http.get('data/series/' + $routeParams.series + "/" + $routeParams.page + '.json').success(function(data){
      if(data.content !== undefined){
        $scope.content = $sce.trustAsHtml(data.content)
        data.content = undefined
      }
      if(data.links !== undefined){
        links.getLinks($routeParams.series, $routeParams.page).then(function(info){
          $scope.links = info.links
          $scope.side = info.side
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
