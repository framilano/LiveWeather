var mesi = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"]
var giornisettimana = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"]
function spawnPaginaGiorno(giorni) {
    //Svuoto il div dinamico
    var dynamicdiv = document.getElementsByClassName('dynamicdiv')[0]
    dynamicdiv.innerHTML = ""

    //Creo un p per un label
    var p = document.createElement('p')
    p.innerText = "Seleziona il giorno per la ricerca"
    dynamicdiv.appendChild(p)

    //Attributi per i radio
    var label
    var input
    var index = 0
    var giornonome
    var giornonumero
    var mese

    //Creo toolbar per radio
    var radiotoolbar = document.createElement('div')
    radiotoolbar.setAttribute('class', 'radio-toolbar')

    //Appendo la toolbar radio al dynamic div
    dynamicdiv.appendChild(radiotoolbar)

    //Creo i radio con i vari giorni al loro interno
    giorni.forEach(element => {
        giornonome = giornisettimana[parseInt(element.split("-")[0])]
        giornonumero = element.split("-")[1]
        mese = element.split("-")[2]
        label = document.createElement('label')
        label.setAttribute('for', giornonumero)
        label.innerHTML = giornonome + " " + giornonumero + " " + mesi[mese]
        input = document.createElement('input')
        input.setAttribute('type', 'radio')
        input.setAttribute('name', 'giornoprompt')
        input.setAttribute('id', giornonumero)
        input.setAttribute('value', giornonumero + "/" + (parseInt(mese) + 1))
        radiotoolbar.appendChild(input)
        radiotoolbar.appendChild(label)
        if (index == 0) {
            input.setAttribute('checked', 'true')
            document.getElementById(giornonumero).focus();
            document.getElementById(giornonumero).select()
        }
        index = 1
    })

    //Aggiungo effetto di fading in ingresso
    $(dynamicdiv).hide().fadeIn(1000);
}

export { spawnPaginaGiorno }