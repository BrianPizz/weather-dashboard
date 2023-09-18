//document variables
var citySearchEl = $('#search-city');
var searchBtn = $('#search');
var currentWeatherEl = $('#current-weather');
var historyEl = $('#history');
var forecastListEl = $('#forecast');
//location variables
var city;
var cityName;
var lat;
var lon;
var cityHistory = [];
//default unit variables
var unit = 'imperial';
var unitLabelTemp = '°F'
var unitLabelSpeed = 'MPH'
//current date
var date = dayjs().format("M/D/YYYY");
//api key
var apiKey = '81aaa12f876e407b2a7bb37f4c2cf924'

//city weather is displayed intially on load
function initLoad() {
    getHistory();
    city = 'Columbus';
    todayForecast();
};
//get history from local storage
function getHistory() {
    historyEl.empty();
    cityHistory = JSON.parse(localStorage.getItem('city'));
    //check if there is any local storage
    if (cityHistory === null) {
        return;
    }
    currentWeatherEl.empty();
    //buttons with history city names are created
    for (let i = 0; i < cityHistory.length; i++) {
        var historyBtn = $('<button>').addClass("btn btn-secondary btn-lg w-100 mt-3 history-btn");
        historyBtn.attr('type', 'button')
        historyBtn.text(cityHistory[i]);
        historyEl.append(historyBtn);
    }
    //if a history button is clicked then that city's weather will be displayed
    $('.history-btn').on('click', function () {
        city = $(this).text();
        todayForecast();
    })
}
//gets the current forecast
function todayForecast() {
    //clears current weather if any
    currentWeatherEl.empty()
    //makes request from api with the city name, units, and api key as parameters
    var currentWeatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + unit + "&appid=" + apiKey;
    $.ajax({
        url: currentWeatherQueryURL,
        method: 'GET',
    }).then(function (data) {
        //city name is added
        cityName = $('<h2>');
        cityName.text(data.name + ',' + ' ')
        currentWeatherEl.append(cityName);
        //weeather icon is added
        var currentIcon = $('<img>').attr('src', 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png');
        currentWeatherEl.append(currentIcon)
        //current temperature is added with propper units
        var currentTemp = $('<p>').addClass('custom-text');
        currentTemp.text("Temp: " + data.main.temp + unitLabelTemp);
        currentWeatherEl.append(currentTemp);
        //current wind speed is added with propper units
        var currentWind = $('<p>').addClass('custom-text');
        currentWind.text("Wind: " + data.wind.speed + " " + unitLabelSpeed)
        currentWeatherEl.append(currentWind);
        //current humidity percentage is added
        var currentHumidity = $('<p>').addClass('custom-text');
        currentHumidity.text("Humidity: " + data.main.humidity + "%");
        currentWeatherEl.append(currentHumidity);
        //calls location function
        getLocation();
    })
};
//gets the city's locations
function getLocation() {
    //makes request from api with the city name and api key as parameters
    var locationQueryUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=&appid=' + apiKey;
    $.ajax({
        url: locationQueryUrl,
        method: 'GET'
    }).then(function (response) {
        //state name is added after city name along with the current date
        cityName.append(response[0].state + ' ' + '-' + ' ' + date);
        //city's latitude and longitude is received to get forecast 
        lat = response[0].lat;
        lon = response[0].lon;
        //calls forecast function
        fiveDayforecast()
    })
}
//gets five day forecast for the city
function fiveDayforecast() {
    //api request is made with the city's latitude, longitude, and units as parameters
    var fiveDayForecastQueryUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=' + unit + '&appid=' + apiKey;
    $.ajax({
        url: fiveDayForecastQueryUrl,
        method: 'GET'
    }).then(function (forecast) {
        //current forecast is cleard
        forecastListEl.empty()
        //loops through forecast to to target the next five days and ignore same day forecasts
        for (let i = 1; i < forecast.list.length; i++) {
            if (forecast.list[i].dt_txt.split(' ')[1] === '21:00:00') {
                var forecastDay = forecast.list[i]
                //forecast cards for each of the 5 days are created
                var forecastCard = $('<div>').addClass('card m-3 bg-dark text-light custom-card');
                forecastListEl.append(forecastCard);
                //dates are added to the cards
                var forecastDate = $('<h4>').addClass('text-center');
                forecastDate.text(dayjs(forecastDay.dt_txt).format('M/D/YYYY'));
                forecastCard.append(forecastDate);
                //weather icons are added to the cards
                var forecastIcon = $('<img>').attr('src', 'https://openweathermap.org/img/wn/' + forecastDay.weather[0].icon + '@2x.png')
                forecastCard.append(forecastIcon);
                //expected temperatures are added to the cards with propper units
                var forecastTemp = $('<p>');
                forecastTemp.text('Temp: ' + forecastDay.main.temp + unitLabelTemp);
                forecastCard.append(forecastTemp);
                //epxected wind speeds are added to the cards with propper units
                var forecastWind = $('<p>');
                forecastWind.text('Wind: ' + forecastDay.wind.speed + ' ' + unitLabelSpeed);
                forecastCard.append(forecastWind);
                //expected humidity percentages are added to the cards
                var forecastHumidity = $('<p>');
                forecastHumidity.text('Humiditiy: ' + forecastDay.main.humidity + '%');
                forecastCard.append(forecastHumidity);
            }
        }
        //search value box is cleared and ready for the next search
        citySearchEl.val('')
    })
}
//when the search button is clicked it executes the weather functions for the searched city
searchBtn.on('click', function () {
    //if no city is searched for the function will stop
    if (citySearchEl.val() === '') {
        return
    }
    //the city variable is assigned but the search input box value
    city = citySearchEl.val();
    //the searched city is added to an array to be stored
    if (cityHistory === null) {
        cityHistory = [city]
    } else {
        cityHistory.push(city);
    }
    //the array of searched cities is stored locally
    localStorage.setItem('city', JSON.stringify(cityHistory));
    //local storage is grabbed  
    getHistory();
    //the forecast function is called
    todayForecast();
})
//the clear button will clear local storage and the list of recent cities searched
$('#clear').on('click', function () {
    localStorage.clear();
    cityHistory = []
    historyEl.empty();
})
//the toggle switch will toggle units between metric and imperial
$('input[name=checkbox]').change(function () {
    if ($(this).is(':checked')) {
        unit = 'metric';
        unitLabelTemp = '°C';
        unitLabelSpeed = 'KM/PH';
        todayForecast();
    } else {
        unit = 'imperial';
        unitLabelTemp = '°F';
        unitLabelSpeed = 'MPH';
        todayForecast();
    }
})
//calls the initial function that will display a city's weather on page load
initLoad();