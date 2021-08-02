import { cittàAttuale } from '/javascripts/service/liveweatherService.js';
//import { fetchCityNames } from '/javascripts/dao/weatherDao.js'

async function spawnPaginaLuogo(cittàprecedente) {
  //Azzero il dynamicdiv
  var div = document.getElementsByClassName("dynamicdiv")[0];
  div.innerHTML = "";

  //Creo il label e l'input cityprompt
  var label = document.createElement("label");
  var input = document.createElement("input");
  //var datalist = document.createElement("datalist");

  label.setAttribute("for", "cityprompt");
  label.innerHTML = "Inserisci nome città <br>";
  input.setAttribute("type", "text");
  input.setAttribute("name", "");
  input.setAttribute("id", "cityprompt");
  //input.setAttribute("list", "citylist");

  //datalist.setAttribute("id", "citylist");

  /**Logica recupero città
  var listacittà = await fetchCityNames();
  listacittà = listacittà.split("\n")
  var option
  var cityname
  listacittà.forEach(element => {
    option = document.createElement('option')
    cityname = element.split(',')[0]
    option.setAttribute('value', cityname)
    option.innerText = element
    datalist.appendChild(option)
  });
  **/
  div.appendChild(label);
  div.appendChild(input);
  //div.appendChild(datalist);

  //Metti a fuoco il prompt appena entrato nella pagina
  document.getElementById("cityprompt").focus();
  document.getElementById("cityprompt").select();

  var p = document.createElement("p");

  //Aggiungo bottone dell'ultima ricerca effettuata
  if (cittàprecedente != null) {
    var buttonLastCity = document.createElement("button");
    p.innerText = "Hai cercato recentemente: ";
    buttonLastCity.innerText = cittàprecedente;
    buttonLastCity.setAttribute("onclick",
      "document.getElementById('cityprompt').value=" + '"' + cittàprecedente + '"');
    p.appendChild(buttonLastCity);
  }

  //Aggiungo bottone della posizione attuale
  if (cittàAttuale != null) {
    var buttonCittàAttuale = document.createElement("button");
    buttonCittàAttuale.innerText = "Posizione attuale"
    buttonCittàAttuale.setAttribute("onclick",
      "document.getElementById('cityprompt').value=" + '"' + cittàAttuale + '"');
    p.appendChild(buttonCittàAttuale)
  }

  div.appendChild(p);
}

export { spawnPaginaLuogo };
