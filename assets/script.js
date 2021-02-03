//Global Variables
var fiveDay = "";
var currentDay = "";
var uvIndex = "";

var submitCity = $('#submit-city');

var forecastURL = 'http://api.openweathermap.org/data/2.5/forecast?units=imperial&q=';
var apiKey = '643023c5499bd5e2ce5d5d93c212f70c';
var appId = '&appid=';




submitCity.on('click', function (event) {
    console.log(event)
    event.preventDefault();
    var searchInput = $('.form-control').val();
    displayWeather(searchInput)

});
function displayWeather(searchInput) {


    var submitURL = forecastURL + searchInput + appId + apiKey;
    //console.log(submitURL)

    //api calls for weather, 5 day forecast and UV index
    $.ajax({
        url: submitURL,
        method: 'GET'
    })
        .then(function (res) {
            fiveDay = res;

            console.log(res);
            var weatherURL = `https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=${res.city.coord.lat}&lon=${res.city.coord.lon}&appId=${apiKey}`
            $.ajax({
                url: weatherURL,
                method: 'GET',
            }).then(res => {
                console.log("current day", res);
                displayCurrentWeather(res.current, searchInput);
                displayFiveDay(res.daily);
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
//functions for local storage
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

//function to display current weather

function displayCurrentWeather(data, city) {
    var date = document.getElementById("weather-date");
    var img = document.getElementById("weather-img");
    var temp = document.getElementById("weather-temp");
    var humidity = document.getElementById("weather-humidity");
    var windspeed = document.getElementById("weather-speed");
    var uv = document.getElementById("weather-uv");
    img.src = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    date.innerHTML = `${city} (${formatDate(new Date(data.dt * 1000))})`;
    temp.innerHTML = `${data.temp}&deg;F`;
    humidity.innerHTML = `${data.humidity}%`;
    windspeed.innerHTML = `${data.wind_speed}mph`;
    uv.innerHTML = data.uvi;
}
//function to display the five day forecast

function displayFiveDay(data) {
    var container = document.getElementById("five-day");
    container.innerHTML = ""
    if (data.length > 0) {
        data.forEach((day, index) => {
            if (index > 0 && index < 6) {
                var listItem = document.createElement("li");
                var date = document.createElement("div");
                var img = document.createElement("img");
                var temp = document.createElement("div");
                var humidity = document.createElement("div");
                listItem.appendChild(date);
                listItem.appendChild(img);
                listItem.appendChild(temp);
                listItem.appendChild(humidity);
                container.appendChild(listItem);
                date.innerHTML = formatDate(new Date(day.dt * 1000))
                img.src = "http://openweathermap.org/img/w/" + day.weather[0].icon + ".png";
                temp.innerHTML = `Temp: ${day.temp.day}&deg;F`
                humidity.innerHTML = `humidity: ${day.humidity}%`
            }
        })
    }
}
function formatDate(date) {
    var month = date.getMonth();
    var day = date.getDate();
    var year = date.getFullYear();
    month = month < 9 ? `0${month + 1}` : month;
    var displayDate = `${month}/${day}/${year}`;
    return displayDate
}





