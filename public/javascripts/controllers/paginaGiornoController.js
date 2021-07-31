var mesi = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"]

function spawnPaginaGiorno(giorni) {
    var div = document.getElementsByClassName('dynamicdiv')[0]
    div.innerHTML = ""
    var p = document.createElement('p')
    p.innerText = "Seleziona il giorno per la ricerca"
    div.appendChild(p)
    var label
    var input
    var index = 0
    var giorno
    var mese
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
        div.appendChild(input)
        div.appendChild(label)
        if (index == 0) {
            input.setAttribute('checked', 'true')
            document.getElementById(giorno).focus();
            document.getElementById(giorno).select()
        }
        index = 1
    })
}

export {spawnPaginaGiorno}