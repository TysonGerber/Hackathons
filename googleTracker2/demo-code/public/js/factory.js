angular.module('tracker')
    .factory('trackFact', tracktory);

tracktory.$inject = ['$http'];

function tracktory($http) {

    function getThings() {
        return $http.get('/api/things');
    }

    function postThings(thingData) {
        return $http.post('/api/things', thingData);
    }

  
    
    return {
        getThings:    getThings,
        postThings:   postThings,
        
    }
};