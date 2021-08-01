var apikey = '3fc89a56dea9dc34ad866668060d3307'

function handleResponse(response) {
    console.log("Ricevo: ", response.status);
    console.log("Da: ", response.url);
    if(response.status != "200") return null;
    return response.json();
}

async function fetchWeather5DaysEvery3Hours(city) {
    return await fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&lang=it&appid=' + apikey)
    .then(handleResponse)
    .catch(() => alert("Errore di connessione"))
}

async function fetchAirPollution(lon, lat) {
    return await fetch('http://api.openweathermap.org/data/2.5/air_pollution?lat='+lat+'&lon='+lon+'&appid='+apikey)
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

export {fetchWeather5DaysEvery3Hours, fetchAirPollution, fetchCityNames}
