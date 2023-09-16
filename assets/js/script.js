var citySearchEl = $('#search-city');
var searchBtn = $('#search');
var currentWeatherEl = $('#current-weather');
var historyEl = $('#history');
var forecastListEl = $('#forecast');

var apiKey = '81aaa12f876e407b2a7bb37f4c2cf924'

var unit = 'imperial';

function changeUnit(){
    unit = 'metric'
} 

function todayForecast() {
    var date = dayjs().format("M/D/YYYY");
    var city = citySearchEl.val();
    var currentWeatherQueryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + unit + "&appid=" + apiKey;


    $.ajax({
        url: currentWeatherQueryURL,
        method: 'GET',
    }).then(function (data) {
        console.log(data);
        
        var cityName = $('<h2>');
        cityName.text(data.name + ' ')
        cityName.append(date)
        currentWeatherEl.append(cityName);

        var currentTemp = $('<p>');
        currentTemp.text("Temp: "+ data.main.temp +"°F");
        currentWeatherEl.append(currentTemp);

        var currentWind = $('<p>');
        currentWind.text("Wind: "+ data.wind.speed + " MPH")
        currentWeatherEl.append(currentWind);

        var currentHumidity = $('<p>');
        currentHumidity.text("Humidity: "+ data.main.humidity +"%");
        currentWeatherEl.append(currentHumidity);


    })

};

searchBtn.on('click', todayForecast)
