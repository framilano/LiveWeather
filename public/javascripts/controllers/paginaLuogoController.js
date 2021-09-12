import { cittàAttuale } from '/javascripts/service/liveweatherService.js';

async function spawnPaginaLuogo(cittàprecedente) {
  //Azzero il dynamicdiv
  var dynamicdiv = document.getElementsByClassName("dynamicdiv")[0];
  dynamicdiv.innerHTML = "";

  //Creo il label e l'input cityprompt
  var label = document.createElement("label");
  var input = document.createElement("input");
  label.setAttribute("for", "cityprompt");
  label.innerHTML = "Inserisci nome città <br>";
  input.setAttribute("type", "text");
  input.setAttribute("name", "");
  input.setAttribute("id", "cityprompt")

  //Appendo il cityprompt ed il suo label al dynamicdiv
  dynamicdiv.appendChild(label);
  dynamicdiv.appendChild(input);

  //Metti a fuoco il prompt appena entrato nella pagina
  document.getElementById("cityprompt").focus();
  document.getElementById("cityprompt").select();

  var pPrecedente = document.createElement("p");
  var pAttuale = document.createElement("p");

  //Aggiungo bottone dell'ultima ricerca effettuata
  if (cittàprecedente != null) {
    var buttonLastCity = document.createElement("button");
    pPrecedente.innerText = "L'ultima città ricercata è stata ";
    buttonLastCity.innerText = cittàprecedente;
    buttonLastCity.setAttribute("onclick",
    "document.getElementById('cityprompt').value=" + '"' + cittàprecedente + '"');
    pPrecedente.appendChild(buttonLastCity);
    dynamicdiv.appendChild(pPrecedente);
  }

  //Aggiungo bottone della posizione attuale
  if (cittàAttuale != null) {
    var buttonCittàAttuale = document.createElement("button");
    pAttuale.innerText = "Oppure inserisci direttamente la tua "
    buttonCittàAttuale.innerText = "Posizione attuale"
    buttonCittàAttuale.setAttribute("onclick",
      "document.getElementById('cityprompt').value=" + '"' + cittàAttuale + '"');
    pAttuale.appendChild(buttonCittàAttuale)
    dynamicdiv.appendChild(pAttuale)
  }

  //Aggiungo effetto di fading in ingresso
  $(dynamicdiv).hide().fadeIn(1000);
}

export { spawnPaginaLuogo };
