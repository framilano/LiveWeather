var mesi = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"]

function spawnPaginaGiorno(giorni) {
    var dynamicdiv = document.getElementsByClassName('dynamicdiv')[0]
    dynamicdiv.innerHTML = ""
    var p = document.createElement('p')
    p.innerText = "Seleziona il giorno per la ricerca"
    dynamicdiv.appendChild(p)
    var label
    var input
    var index = 0
    var giorno
    var mese

    //Creo toolbar per radio
    var radiotoolbar = document.createElement('div')
    radiotoolbar.setAttribute('class', 'radio-toolbar')

    //Appendo la toolbar radio al dynamic div
    dynamicdiv.appendChild(radiotoolbar)

    giorni.forEach(element => {
        giorno = element.split("-")[0]
        mese = element.split("-")[1]
        label = document.createElement('label')
        label.setAttribute('for', giorno)
        label.innerHTML = giorno + " " + mesi[mese] + "<br>"
        input = document.createElement('input')
        input.setAttribute('type', 'radio')
        input.setAttribute('name', 'giornoprompt')
        input.setAttribute('id', giorno)
        input.setAttribute('value', giorno + "/" + (mese + 1))
        radiotoolbar.appendChild(input)
        radiotoolbar.appendChild(label)
        if (index == 0) {
            input.setAttribute('checked', 'true')
            document.getElementById(giorno).focus();
            document.getElementById(giorno).select()
        }
        index = 1
    })

    //Prendo il content per aggiungere il fading
    var content = document.getElementById('content')
    //Aggiungo effetto di fading in ingresso
    $(content).hide().fadeIn(1000);
}

export { spawnPaginaGiorno }