var citySearchEl = $('#search-city');
var searchBtn = $('#search');
var currentWeatherEl = $('#current-weather');
var historyEl = $('#history');
var forecastListEl = $('#forecast');
var city;
var date = dayjs().format("M/D/YYYY");
var cityName;
var lat;
var lon;
var cityHistory = [];
var apiKey = '81aaa12f876e407b2a7bb37f4c2cf924'

var unit = 'imperial';
var unitLabelTemp = '°F'
var unitLabelSpeed = 'MPH'


function initLoad(){
    getHistory();
    city = 'Columbus';
    todayForecast();
};

function getHistory(){
    historyEl.empty();

    cityHistory = JSON.parse(localStorage.getItem('city'));
    if(cityHistory === null){
        return;
    }

    currentWeatherEl.empty();
    for(let i = 0; i < cityHistory.length; i++){
        var historyBtn = $('<button>').addClass("btn btn-secondary btn-lg w-100 mt-3 history-btn");

        historyBtn.attr('type','button')
        historyBtn.text(cityHistory[i]);

        historyEl.append(historyBtn);     
    }
    $('.history-btn').on('click', function () {
          
        city = $(this).text();
        
        todayForecast();
    })
}
function todayForecast() {

    currentWeatherEl.empty()

    var currentWeatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + unit + "&appid=" + apiKey;

    

    $.ajax({
        url: currentWeatherQueryURL,
        method: 'GET',
    }).then(function (data) {

        cityName = $('<h2>');
        cityName.text(data.name + ',' + ' ')
        currentWeatherEl.append(cityName);

        var currentIcon = $('<img>').attr('src','https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png');
        currentWeatherEl.append(currentIcon)


        var currentTemp = $('<p>').addClass('custom-text');
        currentTemp.text("Temp: " + data.main.temp + unitLabelTemp);
        currentWeatherEl.append(currentTemp);

        var currentWind = $('<p>').addClass('custom-text');
        currentWind.text("Wind: " + data.wind.speed + " " + unitLabelSpeed)
        currentWeatherEl.append(currentWind);

        var currentHumidity = $('<p>').addClass('custom-text');
        currentHumidity.text("Humidity: " + data.main.humidity + "%");
        currentWeatherEl.append(currentHumidity);

        getLocation();
    })
};

function getLocation() {

    var locationQueryUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=&appid=' + apiKey;
    $.ajax({
        url: locationQueryUrl,
        method: 'GET'
    }).then(function (response) {
        cityName.append(response[0].state + ' ' + '-' + ' ' + date);
        lat = response[0].lat;
        lon = response[0].lon;

        fiveDayforecast()
    })
}

function fiveDayforecast() {
    var fiveDayForecastQueryUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=' + unit + '&appid=' + apiKey;
    $.ajax({
        url: fiveDayForecastQueryUrl,
        method: 'GET'
    }).then(function (forecast) {
        forecastListEl.empty()
        for (let i = 1; i < forecast.list.length; i++) {
            if (forecast.list[i].dt_txt.split(' ')[1] === '21:00:00') {
                var forecastDay = forecast.list[i]
                
                var forecastCard = $('<div>').addClass('card m-3 bg-dark text-light custom-card');
                forecastListEl.append(forecastCard);

                var forecastDate = $('<h4>').addClass('text-center');
                forecastDate.text(dayjs(forecastDay.dt_txt).format('M/D/YYYY'));
                forecastCard.append(forecastDate);

                var forecastIcon = $('<img>').attr('src','https://openweathermap.org/img/wn/' + forecastDay.weather[0].icon + '@2x.png')
                forecastCard.append(forecastIcon);

                var forecastTemp = $('<p>');
                forecastTemp.text('Temp: ' + forecastDay.main.temp + unitLabelTemp);
                forecastCard.append(forecastTemp);

                var forecastWind = $('<p>');
                forecastWind.text('Wind: ' + forecastDay.wind.speed + ' ' + unitLabelSpeed);
                forecastCard.append(forecastWind);

                var forecastHumidity = $('<p>');
                forecastHumidity.text('Humiditiy: ' + forecastDay.main.humidity + '%');
                forecastCard.append(forecastHumidity);
            }
        }
        citySearchEl.val('')
    })
    
}

function changeUnit() {
    unit = 'metric'
}

searchBtn.on('click', function () {
    if(citySearchEl.val() === ''){
        return
    }
    city = citySearchEl.val();

    if(cityHistory === null){
        cityHistory = [city]
    } else {
        cityHistory.push(city);
    }
    
    localStorage.setItem('city', JSON.stringify(cityHistory));
    getHistory();
    todayForecast();
})

$('#clear').on('click', function(){
    localStorage.clear();
    cityHistory = []
    historyEl.empty();
})

$('input[name=checkbox]').change(function(){
    if($(this).is(':checked')){
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

initLoad();