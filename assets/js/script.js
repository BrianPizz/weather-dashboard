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
var currentTemp;
var currentWind;
var currentHumidity;

var apiKey = '81aaa12f876e407b2a7bb37f4c2cf924'

var unit = 'imperial';

function changeUnit(){
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
        cityName.text(data.name + ','+' ')
        currentWeatherEl.append(cityName);

        currentTemp = $('<p>');
        currentTemp.text("Temp: "+ data.main.temp +"°F");
        currentWeatherEl.append(currentTemp);

        currentWind = $('<p>');
        currentWind.text("Wind: "+ data.wind.speed + " MPH")
        currentWeatherEl.append(currentWind);

        currentHumidity = $('<p>');
        currentHumidity.text("Humidity: "+ data.main.humidity +"%");
        currentWeatherEl.append(currentHumidity);

        getLocation();
    })
};

function getLocation(){
    
    var locationQueryUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=&appid=' + apiKey;
    $.ajax({
        url: locationQueryUrl,
        method: 'GET'
    }).then(function(response){
        console.log(response[0]);
        cityName.append(response[0].state + ' ' + date);
        lat = response[0].lat;
        lon = response[0].lon;

        fiveDayforecast()
    })
}

function fiveDayforecast(){
    console.log(lat);
    console.log(lon);
    
    var fiveDayForecastQueryUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=' + unit + '&appid=' + apiKey;

    $.ajax({
        url: fiveDayForecastQueryUrl,
        method: 'GET'
    }).then(function(forecast){
        for(let i = 0; i < forecast.list.length; i++)
        
        if(forecast.list[i].dt_txt.split(' ')[1] === '12:00:00'){
            console.log(forecast.list[i])
        }
    })
}


searchBtn.on('click', function(){
    city = citySearchEl.val();
    todayForecast();
})

$('.historybtn').on('click', function(){
    city = $(this).text();
    todayForecast();
})


