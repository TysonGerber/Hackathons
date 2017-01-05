angular.module('airApp')
    .controller('airControl', airCtl)

airCtl.$inject = ['$http']
function airCtl($http) {
    var aCtl = this;

    aCtl.title = 'hello';

    //     aCtl.getcity =  function (){
    //           console.log('hello there')
    //          aCtl.cityGet = prompt('Airport City?')

    //     }

    //  aCtl.getcity();

    //aCtl.city = 'Denver'
    //console.dir(aCtl.city)
    
   
    aCtl.name = function () {
        aCtl.city = aCtl.airportCity
        var APPID = process.env.APPID
        console.log('APPID')
        var current_query = 'https://airport.api.aero/airport/match/' + aCtl.city + '?user_key=' + APPID+ ''
        console.dir(current_query)
        $http.get(current_query)
            .then(function (response, error) {
                if (error) {
                    console.log('Error', error)
                }
                aCtl.info = response.data
                console.log(response.data)
                console.log('Printing airport now:')
                aCtl.airportSelect = []
                for (var item in aCtl.info.airports){
                    aCtl.airportSelect.push({name : aCtl.info.airports[item]['name'],code: aCtl.info.airports[item]['code']})
                    console.log(aCtl.airportSelect[aCtl.airportSelect.length-1])
                }

                // for (var item in aCtl.info.airports)
                // {
                //     console.log('Code: ',aCtl.info.airports[item]['code'],' Name: ',aCtl.info.airports[item]['name'])
                // }
                //aCtl.airportquery = aCtl.info.airports[0].code
                //aCtl.getTSA(aCtl.airportquery)
                //aCtl.airportLat = aCtl.info.airports[0].lat
                //aCtl.airportLng = aCtl.info.airports[0].lng
            })
    }
    aCtl.getTSA = function (querycode) {
        var current_tsa_query = 'http://apps.tsa.dhs.gov/MyTSAWebService/GetTSOWaitTimes.ashx?ap=' + querycode
        console.dir(current_tsa_query)
        $http.get(current_tsa_query)
            .then(function (response, error) {
                if (error) {
                    console.log('Error', error)
                }
                aCtl.waitdataTSA = response.data
                console.dir(aCtl.waitdataTSA)
                build_tsa_wait_array()
                //aCtl.getGoogleMap()
            }

            )
    }
    
    aCtl.getGoogleMap = function () {
         var APPID2 = process.env.APPID2
         console.log('APPID2')
        var current_gmap_query = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + aCtl.gStreetAddressClean + ',+' + aCtl.gCity + ',+' + aCtl.gZip + '&destination=' + aCtl.airportLat + ',' + aCtl.airportLng + '&mode=driving&lnaguage=en&key= ' + APPID2 + ''

        // console.log(current_gmap_query)
        $http.get(current_gmap_query)
            .then(function (response, error) {
                if (error) {
                    console.log('Error', error)
                }
                gmap_return = response.data
                console.dir(gmap_return)
                console.log(gmap_return.routes[0]['legs'][0]['duration']['text'])
                aCtl.estDrive = gmap_return.routes[0]['legs'][0]['duration']['text']
            }

            )
    }
    //aCtl.gStreetAddress = '3099 Fulton Cir'
    //aCtl.gStreetAddressClean = '3099+Fulton+Cir'
    //aCtl.gCity = 'Boulder'
    //aCtl.gZip = '80301'


    aCtl.userSubmit = function () {
        aCtl.airportCity = document.getElementById('airportCity').value;
        console.log(aCtl.airportCity)
         aCtl.userStreet = document.getElementById('userStreet').value;
        console.log(aCtl.userStreet)
       aCtl.userCity = document.getElementById('userCity').value;
        console.log(aCtl.userCity)
         aCtl.userState = document.getElementById('userState').value;
            console.log(aCtl.userState)
        aCtl.userZip = document.getElementById('userZip').value;
        console.log(aCtl.userZip)
        aCtl.name()
        aCtl.gStreetAddress = aCtl.userStreet
        aCtl.gStreetAddressClean = stringParse(aCtl.userStreet)
        aCtl.gCity = aCtl.userCity
        aCtl.gZip = aCtl.userZip


}
function get_coords_from_code(find_code){
    var search_code = find_code
    for (var item in aCtl.info.airports){
        if (aCtl.info.airports[item]['code'] === search_code){
            aCtl.airportLat = aCtl.info.airports[item]['lat']
            aCtl.airportLng = aCtl.info.airports[item]['lng']
            aCtl.getGoogleMap()
        }
    }
}
   aCtl.getAirportCode = function() {
       //console.log('start click')
       console.dir(event.target)
       aCtl.getTSA(event.target.innerText)
       //console.log('end click')
       get_coords_from_code(event.target.innerText)
   }
   function stringParse(dirty_address){
       var address = dirty_address
       var add_components = address.split(' ')
       var final_string = ''
       for (var i = 0; i<add_components.length; i++){
           if (i<add_components.length-1){
           final_string += add_components[i]+'+'
           }
           else {
               final_string += add_components[i]
           }
       }

       return final_string
   }

   function tsa_times(process_times){
       var array = process_times
       array.sort(function(a,b){
           return a-b
       }
       )
       var low = array[0]
       var high = array[array.length-1]
       var ave = Math.ceil(average_array(array))
       return {
           short:low,
           high:high,
           average:ave
       }
   }
   function average_array(average_me){
       var array = average_me
       var sum = array.reduce(add,0)
       function add(a,b){
           return a+b
       }
       var average = sum/array.length
       return average
   }
   function build_tsa_wait_array(){
       var tsa_wait_array = []
       for (var item in aCtl.waitdataTSA.WaitTimes){
           tsa_wait_array.push(aCtl.waitdataTSA.WaitTimes[item]['WaitTime'])
       }
       console.log('wait time data is here')
       aCtl.checkpointdata = tsa_times(tsa_wait_array)
      console.dir(aCtl.checkpointdata)
   }


}
