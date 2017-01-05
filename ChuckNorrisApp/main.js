angular.module('chuckApp', [])
    .controller('chuckControl', chuckCtl)

chuckCtl.$inject = ['$http']
function chuckCtl($http) {
    var chckCtl = this;

    chckCtl.title= 'hello'
    chckCtl.show = false;

    chckCtl.greeting = function () {
        $http.get('https://api.chucknorris.io/jokes/random')
            .then(function(response,error) {
            if (error) {
                console.log('Error', error)
            }
            chckCtl.joke = response.data //take the chckCtl.joke and add the object we got in our console 'value' = {{joke.value}}
            console.log(response.data)
            chckCtl.show = true;
            })
    }
    // chckCtl.greeting();



}
