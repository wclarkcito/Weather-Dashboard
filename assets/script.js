//variable for url
var fiveDay = "";
var currentDay = "";
var uvIndex = "";

var submitCity = $('#submit-city');

var forecastURL = 'http://api.openweathermap.org/data/2.5/forecast?q=';
var apiKey = '643023c5499bd5e2ce5d5d93c212f70c';
var appId = '&appid=';
//fetch request for url



submitCity.on('click', function (event) {
    console.log(event)
    event.preventDefault();
    var searchInput = $('.form-control').val();
    var submitURL = forecastURL + searchInput + appId + apiKey;
    //console.log(submitURL)

    $.ajax({
        url: submitURL,
        method: 'GET'
    })
        .then(function (res) {
            fiveDay = res;
            console.log(res);
            var weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${res.city.coord.lat}&lon=${res.city.coord.lon}&appId=${apiKey}`
            $.ajax({
                url: weatherURL,
                method: 'GET',
            }).then(res => {
                console.log(res);
                currentDay = res;
                $.ajax({
                    url: `http://api.openweathermap.org/data/2.5/uvi?lat=${res.lat}&lon=${res.lon}&appId=${apiKey}`
                }).then(res => {
                    uvIndex = res;
                    console.log(res)
                    handleHistory(searchInput)
                })


            })


        })


})

function handleHistory(value) {
    var tempHistory = JSON.parse(window.localStorage.getItem("history"));
    console.log(tempHistory)
    if (tempHistory === null) {
        window.localStorage.setItem("history", JSON.stringify([]));
        tempHistory = [];
        tempHistory.push({
            city: value,
            date: new Date().getTime()
        });
        window.localStorage.setItem("history", JSON.stringify(tempHistory))
        handleHistory(value)
    } else {
        var list = document.getElementById("city");
        tempHistory.forEach((item, index) => {
            var listItem = document.createElement("li");
            listItem.classList.add("item-history");
            listItem.innerHTML = item.city;
            list.appendChild(listItem)

        })
    }
}









