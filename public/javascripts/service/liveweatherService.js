import { fetchWeather5DaysEvery3Hours, fetchWeatherCurrentLocation, requestApiKey, api_key} from '/javascripts/model/weatherAPI.js';

var cittàAttuale = null
var orarioselezionato = null

//Recuperati i dati meteo per i prossimi 5 giorni, restituisce una lista dei giorni resi a disposizione
function filtraGiorni(data5daysList, timezone) {
  var dates = []
  var current = ""
  var day
  var month
  data5daysList.forEach(element => {
    day = new Date((element['dt'] + timezone) * 1000).getUTCDate()
    month = new Date((element['dt'] + timezone) * 1000).getUTCMonth()
    if (day != current) {
      dates.push(day + "-" + month)
      current = day
    }
  });
  return dates;
}

//Controlla se la città inserita è valida per una query
async function checkPaginaLuogoInput(cityname) {
  var data5days = await fetchWeather5DaysEvery3Hours(cityname)
  return data5days
}

//Restituisce gli orari disponibili per il giorno selezionato dall'utente
function checkPaginaGiornoInput(giorniRadio, data5days, timezone) {
  var giornoselezionato = []
  giorniRadio.forEach(element => {
    if (element.checked) giornoselezionato = element.value.split("/")[0]
  })
  var orari = []
  var date
  var begin, end
  data5days['list'].forEach(element => {
    date = new Date((element['dt'] + timezone) * 1000)
    if (date.getUTCDate() == giornoselezionato) {
      begin = (date.getUTCHours() - 3)
      if (begin == -1) begin = "23"
      end = (date.getUTCHours()).toString()
      orari.push(begin + "-" + end)
    }
  });
  if (orari.length == 0) return null
  return orari
}

//Estrae dalla lista dei dati meteo dei prossimi 5 giorni solo i dati rilevanti per la data selezionata dall'utente
function checkOrarioInput(orariRadio, giornoselezionato, data5days, timezone) {
  orariRadio.forEach(element => {
    if (element.checked) orarioselezionato = element.value.split("-")[1]
  })

  giornoselezionato = giornoselezionato.split("/")[0]
  var datiMeteoTemp
  var datiMeteo = null
  data5days['list'].forEach(element => {
    datiMeteoTemp = new Date((element['dt'] + timezone) * 1000)
    if ((giornoselezionato == datiMeteoTemp.getUTCDate()) && (orarioselezionato == datiMeteoTemp.getUTCHours())) datiMeteo = element
  });
  return datiMeteo
}

//Prima funzione di servizio utilizzata, richiama la API KEY e richiede il meteo attuale sulla pagina intro
async function recuperaMeteoLocale(data) {
  var datiMeteoAttuali = await fetchWeatherCurrentLocation(data['coords']['longitude'], data['coords']['latitude'])
  cittàAttuale = datiMeteoAttuali['name']
  return datiMeteoAttuali
}


export {
  checkPaginaLuogoInput, filtraGiorni, checkPaginaGiornoInput,
  checkOrarioInput, recuperaMeteoLocale, cittàAttuale, orarioselezionato
}