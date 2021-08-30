onmessage = async function (msg) {
    console.log("Received lon, lat from main script")
    var lon = msg.data[0]
    var lat = msg.data[1]
    var apikey = '3fc89a56dea9dc34ad866668060d3307'
    var datiInquinamento = await fetch('http://api.openweathermap.org/data/2.5/air_pollution?lat=' + lat + '&lon=' + lon + '&appid=' + apikey)
        .then(response => {
            console.log("Ricevo: ", response.status);
            console.log("Da: ", response.url);
            if (response.status != "200") return null;
            return response.json();
        })
    console.log('Posting message with air pollution data main script');
    postMessage(datiInquinamento);
}