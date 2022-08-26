import { spawnMappaMeteo } from "/javascripts/service/openlayerService.js";
import { checkOrarioInput } from "/javascripts/service/liveweatherService.js";
import { cittàselezionata, label_giornata } from "/javascripts/controllers/liveweatherController.js";


var attributiMeteo = {
    "Temperatura 🌡️": "temp",
    "Temperatura (percepita) 🌡️": "perc",
    "Temperatura massima ☀️": "max",
    "Temperatura minima ❄️": "min",
    "Precipitazioni 🌧️": "pop",
    "Volume precipitazioni (3h)": 'rain',
    "Pressione 🏋️": "press",
    "Umidità 💧": "umid",
    "Velocità vento 🌬️": "wind",
    "Visibilità 👁️": "visib",
    "Alba 🌅": "sunrise",
    "Tramonto 🌇": "sunset",
};

var attributiInquinamento = {
    "Indice qualità dell'aria (AQI) 🌿": "aqi",
    "Concentrazione di monossido di carbonio (CO)": "co",
    "Concentrazione di monossido di nitrogeno (NO)": "no",
    "Concentrazione di diossido di nitrogeno (NO2)": "no2",
    "Concentrazione di Ozono (O3)": "o3",
    "Concentrazione di diossido di Solforo (SO2)": "so2",
    "Concentrazione di polveri fini (PM2.5)": "pm2_5",
    "Concentrazione di polveri (non fini) (PM10)": "pm10",
    "Concentrazione di ammoniaca (NH3)": "nh3",
};

/**
 * Aggiungo dei listener sui radio button dell'orario in modo da aggiornare
 * dinamicamente la pagina in base all'input dell'orario
**/
function aggiungiRadioListener(orariRadio, datiMeteo, giornoselezionato, datiMeteo5Giorni, timezone, datiInquinamento) {
    orariRadio.forEach((element) => {
        element.addEventListener("click", () => {
            //Chiamo lo strato di servizio per ottenere i nuovi dati meteo per il radio orario appena cliccato
            datiMeteo = checkOrarioInput(orariRadio, giornoselezionato, datiMeteo5Giorni, timezone);
            spawnTabelleRisultato(datiMeteo, datiInquinamento, datiMeteo5Giorni, timezone);
        });
    });
}

//Spawn dei radio per la selezione dell'orario
async function spawnPaginaRisultato(orari, giornoselezionato, datiMeteo5Giorni, datiInquinamento, timezone) {
    //Creo la sezione di result con tabelle e mappa, le appendo al div dinamico
    var dynamicdiv = document.getElementsByClassName("dynamicdiv")[0];
    dynamicdiv.innerHTML = "";
    var resultdiv = document.createElement("div");
    resultdiv.setAttribute("class", "resultdiv");
    resultdiv.innerHTML = "";

    //Creo label per gli orari
    var p = document.createElement("p");
    p.innerText = "Tutti gli orari visualizzati sono locali rispetto al luogo scelto.\nSeleziona la fascia oraria per la ricerca";
    dynamicdiv.appendChild(p);
    var label;
    var input;
    var index = 0;
    var hours;
    var minutes;
    var orariRadio = [];

    //Creo toolbar per radio
    var radiotoolbar = document.createElement('div')
    radiotoolbar.setAttribute('class', 'radio-toolbar')

    //Appendo la toolbar radio al dynamic div
    dynamicdiv.appendChild(radiotoolbar)

    //Creo gli input e i label dei radio
    orari.forEach((element) => {
        label = document.createElement("label");
        label.setAttribute("for", element);
        hours = element.split("-")[0];
        minutes = element.split("-")[1];
        if (hours < 10) hours = "0".concat(hours);
        if (minutes < 10) minutes = "0".concat(minutes);
        label.innerHTML = hours + "-" + minutes + "<br>";
        input = document.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("name", "orarioprompt");
        input.setAttribute("id", element);
        input.setAttribute("value", element);
        radiotoolbar.appendChild(input)
        radiotoolbar.appendChild(label)
        if (index == 0) {
            input.setAttribute("checked", "true");
            document.getElementById(element).focus();
            document.getElementById(element).select();
        }
        orariRadio.push(input);
        index = 1;
    });

    //Appendo il resultdiv al dynamicdiv principale
    dynamicdiv.appendChild(resultdiv);


    //Chiamo lo strato di servizio per ottenere idati meteo per il radio orario selezionato
    var datiMeteo = checkOrarioInput(orariRadio, giornoselezionato, datiMeteo5Giorni, timezone);
    spawnTabelleRisultato(datiMeteo, datiInquinamento, datiMeteo5Giorni, timezone);

    //Aggiungo Listener per i radio appena creati
    aggiungiRadioListener(orariRadio, datiMeteo, giornoselezionato, datiMeteo5Giorni, timezone, datiInquinamento);

    //Aggiungo effetto di fading in ingresso
    $(dynamicdiv).hide().fadeIn(1000);
}

//Spawn del div risultato con le tabelle e la mappa al suo interno
function spawnTabelleRisultato(datiMeteo, datiInquinamento, datiMeteo5Giorni, timezone) {
    //Azzero il result div
    var resultdiv = document.getElementsByClassName("resultdiv")[0];
    resultdiv.innerHTML = "";

    //Spawn della mappa
    var divMappa = document.createElement("div");
    divMappa.setAttribute("id", "DivMappa");
    var divMappaContainer = document.createElement("div");
    divMappaContainer.setAttribute("id", "DivMappaContainer");
    divMappaContainer.appendChild(divMappa);
    document.getElementsByClassName("resultdiv")[0].appendChild(divMappaContainer);
    spawnMappaMeteo(datiMeteo5Giorni["city"]["coord"]["lon"], datiMeteo5Giorni["city"]["coord"]["lat"],
        "<h4>"+datiMeteo5Giorni["city"]["name"] + "</h4><br>Condizioni meteo - " + datiMeteo["weather"][0]["description"],
        "/images/WeatherPNGs/" + datiMeteo["weather"]["0"]["icon"] + ".png");

    //Spawn delle tabelle
    spawnTabellaMeteo(datiMeteo);
    riempiTabellaMeteo(datiMeteo, datiMeteo5Giorni, timezone);

    //Se la data attuale corrisponde a quella scelta, mostrare i dati sull'inquinamento
    if (new Date((datiMeteo["dt"] + timezone) * 1000).getUTCDate() == new Date((datiInquinamento["dt"] + timezone) * 1000).getUTCDate()) {
        spawnTabellaInquinamento(datiInquinamento);
        riempiTabellaInquinamento(datiInquinamento);
    }
}

//Spawn della tabella Meteo
function spawnTabellaMeteo(datiMeteo) {
    var resultdiv = document.getElementsByClassName("resultdiv")[0];

    //Creo un p di descrizione del meteo e un'icona descrittiva
    var descriptionP = document.createElement("p");
    descriptionP.innerHTML =
        "Stai visualizzando le condizioni meteo di " + cittàselezionata +
        " per il giorno " + label_giornata


    //Creo la tabella con i dettagli meteo
    var table = document.createElement("table");
    table.setAttribute("id", "meteotable");
    var tr;
    var th;
    var td;
    for (let key in attributiMeteo) {
        tr = document.createElement("tr");
        th = document.createElement("th");
        td = document.createElement("td");
        th.innerText = key;
        td.setAttribute("id", attributiMeteo[key]);
        tr.appendChild(th);
        tr.appendChild(td);
        table.appendChild(tr);
    }

    //Rimuovo il bordo inferiore dell'ultimo th e td, per evitare overlapping
    th.style.borderBottom = 0
    td.style.borderBottom = 0

    //Appendo immagine, descrizione e tabella meteo
    resultdiv.appendChild(descriptionP);
    resultdiv.appendChild(table);

    //Aggiungo effetto di fading in ingresso
    $(table).hide().fadeIn(1000);
}
//Spawn della tabella inquinamento
function spawnTabellaInquinamento() {
    var resultdiv = document.getElementsByClassName("resultdiv")[0];
    var descriptionP = document.createElement("p");
    descriptionP.innerHTML = "Stai visualizzando le informazioni sulla qualità dell'aria <br>" +
        "Per maggiori informazioni <a href=\"https://www.airnow.gov/aqi/aqi-basics/\" target=\"_blank\">AQI basics</a>"
    var table = document.createElement("table");
    table.setAttribute("id", "inquinamentotable");
    var tr;
    var th;
    var td;
    for (let key in attributiInquinamento) {
        tr = document.createElement("tr");
        th = document.createElement("th");
        td = document.createElement("td");
        th.innerText = key;
        td.setAttribute("id", attributiInquinamento[key]);
        tr.appendChild(th);
        tr.appendChild(td);
        table.appendChild(tr);
    }

    //Rimuovo il bordo inferiore dell'ultimo th e td, per evitare overlapping
    th.style.borderBottom = 0
    td.style.borderBottom = 0

    //Appendo descrizione e tabella dell'inquinamento
    resultdiv.appendChild(descriptionP)
    resultdiv.appendChild(table);

    //Aggiungo effetto di fading in ingresso
    $(table).hide().fadeIn(1000);
}

//Riempio la tabella Meteo con i dati ottenuti da fetch
function riempiTabellaMeteo(datiMeteo, datiMeteo5Giorni, timezone) {
    document.getElementById("temp").innerText = (parseFloat(datiMeteo["main"]["temp"])).toFixed(1).toString() + "°C";
    document.getElementById("perc").innerText = (parseFloat(datiMeteo["main"]["feels_like"])).toFixed(1).toString() + "°C";
    document.getElementById("max").innerText = (parseFloat(datiMeteo["main"]["temp_max"])).toFixed(1).toString() + "°C";
    document.getElementById("min").innerText = (parseFloat(datiMeteo["main"]["temp_min"])).toFixed(1).toString() + "°C";
    document.getElementById("pop").innerText = (parseFloat(datiMeteo["pop"]) * 100).toFixed(1).toString() + "%"
    if (datiMeteo["rain"] == undefined) document.getElementById("rain").innerText = "Non disponibile";
    else document.getElementById("rain").innerHTML = datiMeteo["rain"]['3h'] + " mm<sup>3</sup>";
    document.getElementById("press").innerText = datiMeteo["main"]["pressure"] + " hPa";
    document.getElementById("umid").innerText = datiMeteo["main"]["humidity"] + "%";
    document.getElementById("wind").innerText = datiMeteo["wind"]["speed"] + " m/s";
    document.getElementById("visib").innerText = datiMeteo["visibility"] + " m";
    var sunrisehour = new Date((datiMeteo5Giorni["city"]["sunrise"] + timezone) * 1000).getUTCHours();
    var sunsethour = new Date((datiMeteo5Giorni["city"]["sunset"] + timezone) * 1000).getUTCHours();
    var sunriseminute = new Date((datiMeteo5Giorni["city"]["sunrise"] + timezone) * 1000).getUTCMinutes();
    var sunsetminute = new Date((datiMeteo5Giorni["city"]["sunset"] + timezone) * 1000).getUTCMinutes();
    if (sunrisehour < 10) sunrisehour = "0".concat(sunrisehour);
    if (sunriseminute < 10) sunriseminute = "0".concat(sunriseminute);
    document.getElementById("sunrise").innerText = sunrisehour + ":" + sunriseminute;
    if (sunsethour < 10) sunsethour = "0".concat(sunsethour);
    if (sunsetminute < 10) sunsetminute = "0".concat(sunsetminute);
    document.getElementById("sunset").innerText = sunsethour + ":" + sunsetminute;
}

//Riempio la tabella di Inquinamento con i dati ottenuti da fetch
function riempiTabellaInquinamento(datiInquinamento) {
    document.getElementById("aqi").innerHTML = datiInquinamento["main"]["aqi"];
    document.getElementById("co").innerHTML = datiInquinamento["components"]["co"] + " μg/m<sup>3</sup>";
    document.getElementById("no").innerHTML = datiInquinamento["components"]["no"] + " μg/m<sup>3</sup>";
    document.getElementById("no2").innerHTML = datiInquinamento["components"]["no2"] + " μg/m<sup>3</sup>";
    document.getElementById("o3").innerHTML = datiInquinamento["components"]["o3"] + " μg/m<sup>3</sup>";
    document.getElementById("so2").innerHTML = datiInquinamento["components"]["so2"] + " μg/m<sup>3</sup>";
    document.getElementById("pm2_5").innerHTML = datiInquinamento["components"]["pm2_5"] + " μg/m<sup>3</sup>";
    document.getElementById("pm10").innerHTML = datiInquinamento["components"]["pm10"] + " μg/m<sup>3</sup>";
    document.getElementById("nh3").innerHTML = datiInquinamento["components"]["nh3"] + " μg/m<sup>3</sup>";
}

export { spawnPaginaRisultato };
