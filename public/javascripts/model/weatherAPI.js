var api_key = ""

function handleResponse(response) {
    console.log("Ricevo: ", response.status);
    console.log("Da: ", response.url);
    if (response.status != "200") return null;
    return response.json();
}

async function fetchWeather5DaysEvery3Hours(city) {
    return await fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=metric&lang=it&appid=' + api_key['api_key'])
        .then(handleResponse)
        .catch(() => alert("Errore di connessione"))
}

async function fetchWeatherCurrentLocation(lon, lat) {
    return await fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=metric&lang=it&appid=' + api_key['api_key'])
        .then(handleResponse)
        .catch(() => alert("Errore di connessione"))
}

async function requestApiKey() {
    api_key = await fetch("/requestapikey")
    .then(handleResponse)
    .catch(() => alert("Errore di connessione"))
}


export { fetchWeather5DaysEvery3Hours, fetchWeatherCurrentLocation, requestApiKey, api_key }
