//variable for url
var fiveDay = "";
var currentDay = "";
var uvIndex = "";

var submitCity = $('#submit-city');

var forecastURL = 'http://api.openweathermap.org/data/2.5/forecast?q=';
var apiKey = '7bb91bb18b7935d889972f049c9ce57e';
var appId = '&appid=';
//fetch request for url



submitCity.on('click', function (event) {
    console.log(event)
    event.preventDefault();
    var searchInput = $('.form-control').val();
    displayWeather(searchInput)

});
function displayWeather(searchInput) {


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
                console.log("current day", res);
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


}
//local storage
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

    } else {
        var historyFlag = false;
        tempHistory.forEach((query, queryIndex) => {
            if (query.city.toLowerCase() === value.toLowerCase()) {
                historyFlag = true;
                tempHistory[queryIndex].date = new Date().getTime();
                window.localStorage.setItem("history", JSON.stringify(tempHistory));
            }

        });
        if (!historyFlag) {
            tempHistory.push({ city: value, date: new Date().getTime() });
            window.localStorage.setItem("history", JSON.stringify(tempHistory));
        }
        var list = document.getElementById("city");
        list.innerHTML = "";
        tempHistory.forEach((item, index) => {
            var listItem = document.createElement("li");
            listItem.classList.add("item-history");
            listItem.innerHTML = item.city;
            listItem.addEventListener("click", e => displayWeather(item.city));
            list.appendChild(listItem)

        })
    }
}
function displayCurrentWeather(data) {
    var date = document.getElementById("weather-date");
    var img = document.getElementById("weather-img");
    var temp = document.getElementById("weather-temp");
    var humidity = document.getElementById("weather-humidity");
    var windspeed = document.getElementById("weather-speed");
    var uv = document.getElementById("weather-uv");
    img.src = "http://openweathermap.org/img/w/" + /*iconcode*/ + ".png";

}








