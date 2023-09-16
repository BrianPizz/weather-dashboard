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

var apiKey = '81aaa12f876e407b2a7bb37f4c2cf924'

var unit = 'imperial';

function changeUnit() {
    unit = 'metric'
}

function todayForecast() {

    currentWeatherEl.empty()

    var currentWeatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + unit + "&appid=" + apiKey;



    $.ajax({
        url: currentWeatherQueryURL,
        method: 'GET',
    }).then(function (data) {
        console.log(data);

        cityName = $('<h2>');
        cityName.text(data.name + ',' + ' ')
        currentWeatherEl.append(cityName);

        var currentIcon = $('<img>').attr('src','https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png');
        currentWeatherEl.append(currentIcon)


        var currentTemp = $('<p>');
        currentTemp.text("Temp: " + data.main.temp + "°F");
        currentWeatherEl.append(currentTemp);

        var currentWind = $('<p>');
        currentWind.text("Wind: " + data.wind.speed + " MPH")
        currentWeatherEl.append(currentWind);

        var currentHumidity = $('<p>');
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
        console.log(response[0]);
        cityName.append(response[0].state + ' ' + date);
        lat = response[0].lat;
        lon = response[0].lon;

        fiveDayforecast()
    })
}

function fiveDayforecast() {
    console.log(lat);
    console.log(lon);

    var fiveDayForecastQueryUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=' + unit + '&appid=' + apiKey;

    $.ajax({
        url: fiveDayForecastQueryUrl,
        method: 'GET'
    }).then(function (forecast) {
        console.log(forecast)
        forecastListEl.empty()
        for (let i = 1; i < forecast.list.length + 1; i++) {
            if (forecast.list[i].dt_txt.split(' ')[1] === '21:00:00') {
                var forecastDay = forecast.list[i]

                console.log(forecastDay);
                
                var forecastCard = $('<div>').addClass('card m-3 bg-dark text-light custom-card');
                forecastListEl.append(forecastCard);

                var forecastDate = $('<h4>').addClass('text-center');
                forecastDate.text(dayjs(forecastDay.dt_txt).format('M/D/YYYY'));
                forecastCard.append(forecastDate);

                var forecastIcon = $('<img>').attr('src','https://openweathermap.org/img/wn/' + forecastDay.weather[0].icon + '@2x.png')
                forecastCard.append(forecastIcon);

                var forecastTemp = $('<p>');
                forecastTemp.text('Temp: ' + forecastDay.main.temp + '°F');
                forecastCard.append(forecastTemp);

                var forecastWind = $('<p>');
                forecastWind.text('Wind: ' + forecastDay.wind.speed + 'MPH');
                forecastCard.append(forecastWind);

                var forecastHumidity = $('<p>');
                forecastHumidity.text('Humiditiy: ' + forecastDay.main.humidity + '%');
                forecastCard.append(forecastHumidity);
            }
        }
    })
}


searchBtn.on('click', function () {
    city = citySearchEl.val();
    todayForecast();
})

$('.historybtn').on('click', function () {
    city = $(this).text();
    todayForecast();
})


