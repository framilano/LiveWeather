var apikey = '3fc89a56dea9dc34ad866668060d3307'

function handleResponse(response) {
    console.log("Ricevo: ", response.status);
    console.log("Da: ", response.url);
    if(response.status != "200") return null;
    return response.json();
}

async function fetchWeather5DaysEvery3Hours(city) {
    return await fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=metric&lang=it&appid=' + apikey)
    .then(handleResponse)
    .catch(() => alert("Errore di connessione"))
}

async function fetchWeatherCurrentLocation(lon, lat) {
    return await fetch('https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&units=metric&lang=it&appid='+apikey)
    .then(handleResponse)
    .catch(() => alert("Errore di connessione"))
}

async function fetchCityNames() {
    return await fetch('/assets/cities.txt')
    .then(response => {
        console.log("Ricevo: ", response.status);
        console.log("Da: ", response.url);
        if(response.status != "200") return null;
        return response.text()
    })
    .catch(error => alert("Errore di connessione"))
}



export {fetchWeather5DaysEvery3Hours, fetchWeatherCurrentLocation, fetchCityNames}
