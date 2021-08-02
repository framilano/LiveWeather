import { retrieveLocalWeather } from '/javascripts/service/liveweatherService.js';


async function spawnIntro() {
    var dynamicdiv = document.getElementsByClassName('dynamicdiv')[0]
    var pIntro = document.createElement('p')
    var pMeteo = document.createElement('p')
    var meteoattualediv = document.createElement('div')
    var imgMeteoAttuale = document.createElement('img')

    meteoattualediv.setAttribute('id', 'meteoattuale')
    dynamicdiv.innerHTML = ""

    pIntro.innerHTML = "LiveWeather è un servizio meteo gratuito globale per i prossimi 5 giorni<br>"
        + "I dati sono disponibili grazie alla piattaforma <a href=\"https://openweathermap.org/api\">"
        + "OpenWeatherAPI</a> e <a href=\"https://openweathermap.org/api/air-pollution\">AQI</a>"

    dynamicdiv.appendChild(pIntro)
    dynamicdiv.appendChild(meteoattualediv)
    dynamicdiv.appendChild(imgMeteoAttuale)

    navigator.geolocation.getCurrentPosition(async (data) => {
        var datiMeteoAttuali = await retrieveLocalWeather(data)
        var descrizione = datiMeteoAttuali['weather'][0]['description']

        //Estraggo descrizione del meteo
        descrizione = descrizione.split("")
        descrizione[0] = descrizione[0].toUpperCase()
        descrizione = descrizione.toString().replaceAll(',', '')
        
        //Aggiungo una breve descrizione del meteo
        pMeteo.innerText = "In questo momento a " + datiMeteoAttuali['name'] + " la temperatura è " +
        "di " + datiMeteoAttuali['main']['temp'] + " gradi.\n\n" + descrizione

        //Aggiungo un'immagine meteo
        imgMeteoAttuale.setAttribute('src', "/images/WeatherPNGs/" + datiMeteoAttuali["weather"][0]["icon"] + ".png")
    }, () => {
        pMeteo.innerText = "Non è possibile verificare la tua posizione attuale\nAssicurati di aver attivato la geolocalizzazione sul tuo Browser"
    })
    meteoattualediv.appendChild(pMeteo)
}

export { spawnIntro }