import {checkPaginaLuogoInput, filtraGiorni, checkPaginaGiornoInput, generaDatiInquinamento} from '/javascripts/service/liveweatherService.js';
import {spawnIntro} from '/javascripts/controllers/paginaIntroController.js';
import {spawnPaginaLuogo} from '/javascripts/controllers/paginaLuogoController.js';
import {spawnPaginaGiorno} from '/javascripts/controllers/paginaGiornoController.js';
import {spawnInputOrario} from '/javascripts/controllers/paginaRisultatoController.js';

//Listener per bottoni di avanti e indietro e tasto invio
document.getElementById('submitbtnforward').addEventListener('click', cambiaScenaAvanti)
document.getElementById('submitbtnback').addEventListener('click', cambiaScenaIndietro)
document.addEventListener('keyup', event => {
  if (event.key=="Enter") cambiaScenaAvanti()
})


//Contiene le città precedentemente cercate
var cittàprecedente
//Contiene città selezionata
var cittàselezionata
//Contiene la longitudine
var lon
//Contiene la latitudine
var lat
//Contiene la timezone del luogo cercato
var timezone
//Contiene i dati dei prossimi 5 giorni per il luogo ricercato
var datiMeteo5Giorni
//Contiene i giorni estratti da datiMeteo5Giorni
var giorni
//Contiene il giorno selezionato dall'utente
var giornoselezionato
//Contiene gli orari disponibili per il giornoselezionato
var orari
//Contiene l'orario selezionato
var orarioselezionato
//Contiene i dati meteo finali singoli
var datiMeteo
//Contiene i dati inquinamento finali
var datiInquinamento

async function cambiaScenaAvanti() {
  var attuale = document.getElementsByClassName('dynamicdiv')[0]
  switch (attuale.getAttribute('id')) {
    case "intro":
      //Recupero l'ultima città ricercata
      cittàprecedente = localStorage.getItem('lastcity')

      //Cambio dinamico del div
      attuale.setAttribute('id', 'paginaluogo')
      spawnPaginaLuogo(cittàprecedente)
      document.getElementById('submitbtnback').hidden = 0
      break

    case "paginaluogo":
      //Ottengo dizionario con info per i prossimi 5 giorni
      datiMeteo5Giorni = await checkPaginaLuogoInput(document.getElementById('cityprompt').value)
      //Controllo se la request ha restituito un risultato nullo
      if (datiMeteo5Giorni == null) {
        alert("Inserisci un luogo valido")
        return
      }

      //Salvo la città selezionata, la sua longitudine, latitudine e la timezone
      cittàselezionata = document.getElementById('cityprompt').value
      lon = datiMeteo5Giorni['city']['coord']['lon']
      lat = datiMeteo5Giorni['city']['coord']['lat']
      timezone = datiMeteo5Giorni['city']['timezone']
      localStorage.setItem('lastcity', cittàselezionata)
      //In caso tornasse indietro l'utente
      cittàprecedente = cittàselezionata
      //Ottengo dati inquinamento attuali, utilizzabili solo se l'utente richiede meteo per il giorno stesso
      datiInquinamento = await generaDatiInquinamento(lon, lat)
      //Filtro i giorni disponibili
      giorni = filtraGiorni(datiMeteo5Giorni['list'], timezone)
      //Cambio dinamico del div
      attuale.setAttribute('id', 'paginagiorno')
      spawnPaginaGiorno(giorni)
      break;
    
    case "paginagiorno":
      //Ottengo gli orari possibili per il giorno selezionato
      orari = checkPaginaGiornoInput(document.getElementsByName('giornoprompt'), datiMeteo5Giorni, timezone)
      //Se nullo, ripetere l'input
      if (orari == null) {
        alert("Inserisci un giorno valido")
        return
      }
      //Salvo il giorno selezionato estraendolo dai radio
      document.getElementsByName('giornoprompt').forEach(element => {
        if(element.checked) giornoselezionato = element.value.split("/")[0]
      })
      //Cambio dinamico del div
      attuale.setAttribute('id', 'paginarisultato')
      document.getElementById('submitbtnforward').hidden = 1
      document.getElementById('content').style.marginTop = "0%"
      spawnInputOrario(orari, giornoselezionato, datiMeteo5Giorni, datiInquinamento, timezone)
      break;
  }
}

function cambiaScenaIndietro() {
  var attuale = document.getElementsByClassName('dynamicdiv')[0]
  switch (attuale.getAttribute('id')) {
    case "paginaluogo":
      //Cambio dinamico del div
      attuale.setAttribute('id', 'intro')
      spawnIntro()
      document.getElementById('submitbtnback').hidden = 1
      document.getElementById('content').style.marginTop = "12%"
      break;

    case "paginagiorno":
      //Cambio dinamico del div
      attuale.setAttribute('id', 'paginaluogo')
      spawnPaginaLuogo(cittàprecedente)
      break;

    case "paginarisultato":
      //Cambio dinamico del div
      attuale.setAttribute('id', 'paginagiorno')
      spawnPaginaGiorno(giorni)
      document.getElementById('submitbtnforward').hidden = 0
      document.getElementById('content').style.marginTop = "12%"
      break
  }
}

spawnIntro()
