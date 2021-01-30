
var requestUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=USA&appid=643023c5499bd5e2ce5d5d93c212f70c'

fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    })

for (var i = 0; i < data.length; i++) {
    var createCityList = document.createElement('ul')

}


