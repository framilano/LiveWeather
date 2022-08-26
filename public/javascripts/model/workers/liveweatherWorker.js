//Worker che recupera in background le informazioni sui dati ambientali
onmessage = async function (msg) {
    console.log("Received lon, lat and api_key from main script")
    var lon = msg.data[0]
    var lat = msg.data[1]
    var api_key = msg.data[2]
    datiInquinamento = await fetch('https://api.openweathermap.org/data/2.5/air_pollution?lat=' + lat + '&lon=' + lon + '&appid=' + api_key)
    .then(response => {
        console.log("Ricevo: ", response.status);
        console.log("Da: ", response.url);
        if (response.status != "200") return null;
        return response.json()
    })
    console.log('Posting message with air pollution data to main script');
    postMessage(datiInquinamento);
}