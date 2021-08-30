onmessage = async function (msg) {
    console.log("Received message from main script")
    var datiInquinamento = await fetchAirPollution(msg.data[0], msg.data[1])
    console.log('Posting message back to main script');
    postMessage(datiInquinamento);
}

var apikey = '3fc89a56dea9dc34ad866668060d3307'

function handleResponse(response) {
    console.log("Ricevo: ", response.status);
    console.log("Da: ", response.url);
    if(response.status != "200") return null;
    return response.json();
}

async function fetchAirPollution(lon, lat) {
    return await fetch('http://api.openweathermap.org/data/2.5/air_pollution?lat=' + lat + '&lon=' + lon + '&appid=' + apikey)
        .then(handleResponse)
        .catch(() => alert("Errore di connessione"))
}