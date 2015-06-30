
var app = angular.module('app', ['directives']);


app.factory('Data', ['$http', function($http){

  var waterData = $http.get('data/water.json').then(function(data){
    return data.data
  })

  return {
    getData : function(type){
      return waterData.then(function(data){
        var i = 0
        Object.keys(data).forEach(function(cat){
          data[cat] = {'value' : data[cat], 'index' : i}
        })
        console.log(data)
        return data[type]
      })
    }
  }

}])

app.controller('CatsController', ['$scope', 'Data', function($scope, data){

  data.getData($scope.domain).then(function(cats){
    $scope.cats = cats
    $scope.current = 0
  })

}])

