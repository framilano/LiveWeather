import {fetchWeather5DaysEvery3Hours, fetchAirPollution} from '/javascripts/dao/weatherDao.js';

function filtraGiorni(data5daysList, timezone) {
    var dates = []
    var current = ""
    var day
    var month
    data5daysList.forEach(element => {
      day = new Date((element['dt'] + timezone)*1000).getUTCDate()
      month = new Date((element['dt'] + timezone)*1000).getUTCMonth()
      if (day != current) {
        dates.push(day+"-"+month)
        current = day
      }
    });
    return dates
}

async function checkPaginaLuogoInput(cityname) {
    var data5days = await fetchWeather5DaysEvery3Hours(cityname)
    return data5days
}

function checkPaginaGiornoInput(giorniRadio, data5days, timezone) {
  var giornoselezionato = []
  giorniRadio.forEach(element => {
    if(element.checked) giornoselezionato = element.value.split("/")[0]
  })
  var orari = []
  var date
  var begin, end
  data5days['list'].forEach(element => {
    date = new Date((element['dt'] + timezone)*1000)
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

function checkInputOrario(orariRadio, giornoselezionato, data5days, timezone) {
  var orarioselezionato
  orariRadio.forEach(element => {
    if(element.checked) orarioselezionato = element.value.split("-")[1]
  })

  giornoselezionato = giornoselezionato.split("/")[0]
  var datiMeteoTemp
  var datiMeteo = null
  data5days['list'].forEach(element => {
    datiMeteoTemp = new Date((element['dt'] + timezone)*1000)
    if((giornoselezionato == datiMeteoTemp.getUTCDate()) && (orarioselezionato == datiMeteoTemp.getUTCHours())) datiMeteo = element
  });
  return datiMeteo
}

async function generaDatiInquinamento(lon, lat) {
  var datiInquinamento = await fetchAirPollution(lon, lat)
  return datiInquinamento['list'][0]
}

export {checkPaginaLuogoInput, filtraGiorni, checkPaginaGiornoInput, checkInputOrario, generaDatiInquinamento}