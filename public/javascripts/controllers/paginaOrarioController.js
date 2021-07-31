function spawnPaginaOrario(orari) {
    var div = document.getElementsByClassName('dynamicdiv')[0]
    div.innerHTML = ""
    var p = document.createElement('p')
    p.innerText = "Seleziona la fascia oraria per la ricerca"
    div.appendChild(p)
    var label
    var input
    var index = 0
    var hours 
    var minutes
    orari.forEach(element => {
        label = document.createElement('label')
        label.setAttribute('for', element)
        hours = element.split("-")[0]
        minutes = element.split("-")[1]
        if (hours < 10) hours = "0".concat(hours)
        if (minutes < 10) minutes = "0".concat(minutes)
        label.innerHTML = hours + "-" + minutes + "<br>"
        input = document.createElement('input')
        input.setAttribute('type', 'radio')
        input.setAttribute('name', 'orarioprompt')
        input.setAttribute('id', element)
        input.setAttribute('value', element)
        div.appendChild(input)
        div.appendChild(label)
        if (index == 0) {
            input.setAttribute('checked', 'true')
            document.getElementById(element).focus();
            document.getElementById(element).select()
        }
        index = 1
    })
}

export {spawnPaginaOrario}