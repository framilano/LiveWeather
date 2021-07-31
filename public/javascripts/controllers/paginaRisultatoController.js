import {spawnMappaMeteo} from '/javascripts/service/openlayerService.js';

function spawnPaginaRisultato(datiMeteo, datiInquinamento, datiMeteo5Giorni, timezone) {
    spawnTabellaMeteo(datiMeteo)
    riempiTabellaMeteo(datiMeteo, datiMeteo5Giorni, timezone)

    //Default stile della tabella meteo se non presente la tabella inquinamento
    document.getElementById('meteotable').style.float = null
    document.getElementById('meteotable').style.width="100%"
    

    //Se la data attuale corrisponde a quella scelta, mostrare i dati sull'inquinamento
    if (new Date((datiMeteo['dt'] + timezone) * 1000).getUTCDate() == new Date((datiInquinamento['dt'] + timezone) * 1000).getUTCDate()) {
        document.getElementById('meteotable').style.width="50%"
        document.getElementById('meteotable').style.float = "left"
        spawnTabellaInquinamento(datiInquinamento)
        riempiTabellaInquinamento(datiInquinamento)
    }

    //Spawn della mappa
    var divMappa = document.createElement('div')
    divMappa.setAttribute('id', 'DivMappa')
    var divMappaContainer = document.createElement('div')
    divMappaContainer.setAttribute('id', 'DivMappaContainer')
    divMappaContainer.appendChild(divMappa)
    document.getElementsByClassName('dynamicdiv')[0].appendChild(divMappaContainer)
    spawnMappaMeteo(datiMeteo5Giorni['city']['coord']['lon'], 
        datiMeteo5Giorni['city']['coord']['lat'], datiMeteo5Giorni['city']['name'], "/images/WeatherPNGs/" + datiMeteo['weather']['0']['icon']+".png")

}

function spawnTabellaMeteo(datiMeteo) {
    var div = document.getElementsByClassName('dynamicdiv')[0]
    div.innerHTML = ""
    //Creo un p di descrizione del meteo e un'icona descrittiva
    var img = document.createElement('img')
    img.setAttribute('src', "/images/WeatherPNGs/" + datiMeteo['weather'][0]['icon'] + ".png")
    img.setAttribute('alt', datiMeteo['weather'][0]['description'])
    var descriptionP = document.createElement('p')
    descriptionP.setAttribute('id', "descrizione")
    descriptionP.innerHTML = "Condizioni meteo: " + datiMeteo['weather'][0]['description']
    div.appendChild(img)
    div.appendChild(descriptionP)

    //Creo la tabella con i dettagli meteo
    var table = document.createElement('table')
    table.setAttribute('id', 'meteotable')
    var tr
    var th
    var td
    for (let key in attributiMeteo) {
        tr = document.createElement('tr')

        th = document.createElement('th')
        td = document.createElement('td')
        th.innerText = key
        td.setAttribute('id', attributiMeteo[key])
        tr.appendChild(th)
        tr.appendChild(td)
        table.appendChild(tr)
    }
    div.appendChild(table)
}

function spawnTabellaInquinamento() {
    var div = document.getElementsByClassName('dynamicdiv')[0]

    var table = document.createElement('table')
    table.setAttribute('id', 'inquinamentotable')
    var tr
    var th
    var td
    for (let key in attributiInquinamento) {
        tr = document.createElement('tr')
        th = document.createElement('th')
        td = document.createElement('td')
        th.innerText = key
        td.setAttribute('id', attributiInquinamento[key])
        tr.appendChild(th)
        tr.appendChild(td)
        table.appendChild(tr)
    }
    div.appendChild(table)
}

var attributiMeteo = {
    "Temperatura": 'temp', "Temperatura (percepita)": 'perc', 'Temperatura minima': 'min',
    "Temperatura massima": 'max', "Pressione": 'press', "Umidità 💧": "umid", "Velocità vento 🌬️": "wind", "Visibilità 👁️": 'visib',
    "Alba 🌅": "sunrise", "Tramonto 🌇": "sunset"
}

var attributiInquinamento = {
    "Indice qualità dell'aria": 'aqi', "Concentrazione di monossido di carbonio (CO)": 'co',
    "Concentrazione di monossido di nitrogeno (NO)": 'no', "Concentrazione di diossido di nitrogeno (NO2)": 'no2',
    "Concentrazione di Ozono (O3)": 'o3', "Concentrazione di diossido di Solforo (SO2)": 'so2', "Concentrazione di polveri fini (PM2.5)": 'pm2_5',
    "Concentrazione di polveri (non fini) (PM10)": 'pm10', "Concentrazione di ammoniaca (NH3)": "nh3"
}

function riempiTabellaMeteo(datiMeteo, datiMeteo5Giorni, timezone) {
    document.getElementById('temp').innerText = (parseFloat(datiMeteo['main']['temp']) - 273.15).toFixed(1).toString() + "°C"
    document.getElementById('perc').innerText = (parseFloat(datiMeteo['main']['feels_like']) - 273.15).toFixed(1).toString() + "°C"
    document.getElementById('min').innerText = (parseFloat(datiMeteo['main']['temp_min']) - 273.15).toFixed(1).toString() + "°C"
    document.getElementById('max').innerText = (parseFloat(datiMeteo['main']['temp_max']) - 273.15).toFixed(1).toString() + "°C"
    document.getElementById('press').innerText = datiMeteo['main']['pressure'] + " hPa"
    document.getElementById('umid').innerText = datiMeteo['main']['humidity'] + "%"
    document.getElementById('wind').innerText = datiMeteo['wind']['speed'] + " m/s"
    document.getElementById('visib').innerText = datiMeteo['visibility'] + " m"
    var sunrisehour = new Date((datiMeteo5Giorni['city']['sunrise'] + timezone) * 1000).getUTCHours()
    var sunsethour = new Date((datiMeteo5Giorni['city']['sunset'] + timezone) * 1000).getUTCHours()
    var sunriseminute = new Date((datiMeteo5Giorni['city']['sunrise'] + timezone) * 1000).getUTCMinutes()
    var sunsetminute = new Date((datiMeteo5Giorni['city']['sunset'] + timezone) * 1000).getUTCMinutes()
    if (sunrisehour < 10) sunrisehour = "0".concat(sunrisehour)
    if (sunriseminute < 10) sunriseminute = "0".concat(sunriseminute)
    document.getElementById('sunrise').innerText = sunrisehour + ":" + sunriseminute
    if (sunsethour < 10) sunsethour = "0".concat(sunsethour)
    if (sunsetminute < 10) sunsetminute = "0".concat(sunsetminute)
    document.getElementById('sunset').innerText = sunsethour + ":" + sunsetminute
}

function riempiTabellaInquinamento(datiInquinamento) {
    document.getElementById('aqi').innerText = datiInquinamento['main']['aqi']
    document.getElementById('co').innerText = datiInquinamento['components']['co'] + ' μg/m3'
    document.getElementById('no').innerText = datiInquinamento['components']['no'] + ' μg/m3'
    document.getElementById('no2').innerText = datiInquinamento['components']['no2'] + ' μg/m3'
    document.getElementById('o3').innerText = datiInquinamento['components']['o3'] + ' μg/m3'
    document.getElementById('so2').innerText = datiInquinamento['components']['so2'] + ' μg/m3'
    document.getElementById('pm2_5').innerText = datiInquinamento['components']['pm2_5'] + ' μg/m3'
    document.getElementById('pm10').innerText = datiInquinamento['components']['pm10'] + ' μg/m3'
    document.getElementById('nh3').innerText = datiInquinamento['components']['nh3'] + ' μg/m3'
}

export { spawnPaginaRisultato }