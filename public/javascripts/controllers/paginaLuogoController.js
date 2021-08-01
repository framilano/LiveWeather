import { fetchCityNames } from '/javascripts/dao/weatherDao.js'

async function spawnPaginaLuogo(cittàprecedente) {
  //Azzero il dynamicdiv
  var div = document.getElementsByClassName("dynamicdiv")[0];
  div.innerHTML = "";

  //Creo il label e l'input cityprompt
  var label = document.createElement("label");
  var input = document.createElement("input");
  var datalist = document.createElement("datalist");

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
  if (cittàprecedente != null) {
    var p = document.createElement("p");
    var button = document.createElement("button");
    p.innerText = "Hai cercato recentemente: ";
    button.innerText = cittàprecedente;
    button.setAttribute(
      "onclick",
      "document.getElementById('cityprompt').value=" +
      '"' +
      cittàprecedente +
      '"'
    );
    p.appendChild(button);
    div.appendChild(p);
  }
}

export { spawnPaginaLuogo };
