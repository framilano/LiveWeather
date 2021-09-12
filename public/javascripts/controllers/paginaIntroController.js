import { recuperaMeteoLocale } from '/javascripts/service/liveweatherService.js';

//Spawn pagina iniziale
async function spawnIntro() {
    var dynamicdiv = document.getElementsByClassName('dynamicdiv')[0]
    var pIntro = document.createElement('p')
    var pMeteo = document.createElement('p')
    var meteoattualediv = document.createElement('div')
    var imgMeteoAttuale = document.createElement('img')

    meteoattualediv.setAttribute('id', 'meteoattuale')
    dynamicdiv.innerHTML = ""

    //Descrizione introduttiva
    pIntro.innerHTML = "LiveWeather è un servizio meteo gratuito globale  con previsioni per i prossimi 5 giorni (120 ore)<br>"
        + "I dati sono resi disponibili grazie alla piattaforma <a href=\"https://openweathermap.org/api\" target=\"_blank\">"
        + "OpenWeatherAPI</a> e <a href=\"https://aqicn.org/api/\" target=\"_blank\">AQI</a>"

    //Appendo l'intro ed il meteoattuale al dynamicdiv
    dynamicdiv.appendChild(pIntro)
    dynamicdiv.appendChild(meteoattualediv)
    dynamicdiv.appendChild(imgMeteoAttuale)
    //Ottengo posizione attuale
    navigator.geolocation.getCurrentPosition(async (data) => {
        var datiMeteoAttuali = await recuperaMeteoLocale(data)
        var descrizione = datiMeteoAttuali['weather'][0]['description']

        //Estraggo descrizione del meteo
        descrizione = descrizione.split("")
        descrizione[0] = descrizione[0].toUpperCase()
        descrizione = descrizione.toString().replaceAll(',', '')

        //Aggiungo una breve descrizione del meteo
        pMeteo.innerText = "In questo momento a " + datiMeteoAttuali['name'] + " la temperatura è " +
            "di " + datiMeteoAttuali['main']['temp'] + "°C.\n\n" + descrizione

        //Aggiungo un'immagine meteo
        imgMeteoAttuale.setAttribute('src', "/images/WeatherPNGs/" + datiMeteoAttuali["weather"][0]["icon"] + ".png")
        imgMeteoAttuale.setAttribute("title", datiMeteoAttuali["weather"][0]["description"]);

    //Gestisco l'assenza di permessi per la geolocalizzazione
    }, () => {
        pMeteo.innerText = "Non è possibile verificare la tua posizione attuale\nAssicurati di aver attivato la geolocalizzazione sul tuo Browser"
    })

    //Aggiungo il messaggio di successo o di errore al termine della geolocalizzazione
    meteoattualediv.appendChild(pMeteo)
    
    //Aggiungo effetto di fading in ingresso
    $(dynamicdiv).hide().fadeIn(1000);
}

export { spawnIntro }