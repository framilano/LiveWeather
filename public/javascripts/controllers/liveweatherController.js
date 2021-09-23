import { checkPaginaLuogoInput, filtraGiorni, checkPaginaGiornoInput } from '/javascripts/service/liveweatherService.js';
import { spawnIntro } from '/javascripts/controllers/paginaIntroController.js';
import { spawnPaginaLuogo } from '/javascripts/controllers/paginaLuogoController.js';
import { spawnPaginaGiorno } from '/javascripts/controllers/paginaGiornoController.js';
import { spawnPaginaRisultato } from '/javascripts/controllers/paginaRisultatoController.js';
import { requestApiKey  } from '../model/weatherAPI.js';
import { api_key } from '/javascripts/model/weatherAPI.js'

//Listener per bottoni di avanti e indietro e tasto invio
document.getElementById('submitbtnforward').addEventListener('click', cambiaScenaAvanti)
document.getElementById('submitbtnback').addEventListener('click', cambiaScenaIndietro)
document.addEventListener('keyup', event => {
  if (event.key == "Enter") cambiaScenaAvanti()
})

//Attributi condivisi durante la navigazione delle varie sezioni del sito

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
//Contiene i dati inquinamento finali
var datiInquinamento
//Classe attualmente utilizzata dal dynamicdiv
var attuale
//Salvo la data attuale in una stringa
var label_giornata

/**
 * Risponde al bottono avanti nella pagina principale
 * controllando con uno switch i vari casi in base a che sezione stiamo utilizzando
**/
async function cambiaScenaAvanti() {
  attuale = document.getElementsByClassName('dynamicdiv')[0]
  switch (attuale.getAttribute('id')) {
    case "intro":
      //Recupero l'ultima città ricercata
      cittàprecedente = localStorage.getItem('lastcity')

      //Cambio dinamico del div
      attuale.setAttribute('id', 'paginaluogo')

      //Richiedo lo spawn dell'input Luogo
      spawnPaginaLuogo(cittàprecedente)

      //Appare il tasto per tornare indietro
      document.getElementById('submitbtnback').hidden = 0
      break

    case "paginaluogo":
      //Ottengo dizionario con info per i prossimi 5 giorni
      datiMeteo5Giorni = await checkPaginaLuogoInput(document.getElementById('cityprompt').value)

      //Controllo se la request ha restituito un risultato nullo
      if (datiMeteo5Giorni == null) {
        document.getElementById('cityprompt').style.border = "3px solid red"
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
      //Implementata questa richiesta tramite WebWorker
      var liveweatherWorker = new Worker("/javascripts/model/workers/liveweatherWorker.js")
      console.log("Posted lon, lat and api_key to WebWorker")
      liveweatherWorker.postMessage([lon, lat, api_key['api_key']])
      liveweatherWorker.onmessage = function (msg) {
        console.log("Received air pollution data from WebWorker")
        datiInquinamento = msg.data['list'][0]
      }

      //Filtro i giorni disponibili
      giorni = filtraGiorni(datiMeteo5Giorni['list'], timezone)

      //Cambio dinamico del div
      attuale.setAttribute('id', 'paginagiorno')

      //Richiedo lo spawn dell'input Giorno
      spawnPaginaGiorno(giorni)
      break;

    case "paginagiorno":
      //Ottengo gli orari possibili per il giorno selezionato
      orari = checkPaginaGiornoInput(document.getElementsByName('giornoprompt'), datiMeteo5Giorni, timezone)
      
      //Se nullo, ripetere l'input (non dovrebbe essere possibile essendo la scelta limitata)
      if (orari == null) {
        alert("Inserisci un giorno valido")
        return
      }

      //Salvo il giorno selezionato estraendolo dai radio
      document.getElementsByName('giornoprompt').forEach(element => {
        if (element.checked) {
          //Salvo in giornoselezionato il giorno (numero)
          giornoselezionato = element.value.split("/")[0]
          return
        }
      })

      //Recupero label_giornata
      //Necessario Array.from poichè getElementsByTagName restituisce una HTMLCollection (che non è un array)
      //forEach funziona solo con gli array
      Array.from(document.getElementsByTagName('label')).forEach(element => {
        if (element.getAttribute('for') == giornoselezionato) {
          label_giornata = element.innerHTML
        }
      })

      //Cambio dinamico del div
      attuale.setAttribute('id', 'paginarisultato')

      //Scompare il tasto avanti
      document.getElementById('submitbtnforward').hidden = 1
      document.getElementsByClassName('dynamicdiv')[0].style.marginTop = "0%"

      //Richiedo lo spawn dei vari orari da cui scegliere insieme alle tabelle meteo e inquinamento, (mando solo il giorno senza il mese)
      spawnPaginaRisultato(orari, giornoselezionato, datiMeteo5Giorni, datiInquinamento, timezone)
      break;
  }
}

/**
 * Risponde al bottono indietro nella pagina principale
 * controllando con uno switch i vari casi in base a che sezione stiamo utilizzando
**/
function cambiaScenaIndietro() {
  attuale = document.getElementsByClassName('dynamicdiv')[0]
  switch (attuale.getAttribute('id')) {
    case "paginaluogo":
      //Cambio dinamico del div
      attuale.setAttribute('id', 'intro')

      //Torno indietro alla pagina iniziale
      spawnIntro()

      //Scompare il tasto indietro
      document.getElementById('submitbtnback').hidden = 1
      document.getElementsByClassName('dynamicdiv')[0].style.marginTop = "7%"
      break;

    case "paginagiorno":
      //Cambio dinamico del div
      attuale.setAttribute('id', 'paginaluogo')

      //Torno indietro nella pagina luogo
      spawnPaginaLuogo(cittàprecedente)
      break;

    case "paginarisultato":
      //Cambio dinamico del div
      attuale.setAttribute('id', 'paginagiorno')

      //Torno indietro nella pagina di selezione del giorno
      spawnPaginaGiorno(giorni)

      //Riappare il tasto avanti
      document.getElementById('submitbtnforward').hidden = 0
      document.getElementsByClassName('dynamicdiv')[0].style.marginTop = "7%"
      break
  }
}

//Richiedo 
await requestApiKey()
//Funzione iniziale appena caricato liveweather.ejs dalle views
spawnIntro()

export { cittàselezionata, label_giornata }