function spawnPaginaLuogo(cittàprecedente) {
    var div = document.getElementsByClassName('dynamicdiv')[0]
    div.innerHTML = ""
    var label = document.createElement('label')
    label.setAttribute('for', 'cityprompt')
    label.innerHTML = "Inserisci nome città <br>"
    var input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.setAttribute('name', "")
    input.setAttribute('id', 'cityprompt')
    div.appendChild(label)
    div.appendChild(input)
    //Metti a fuoco il prompt appena entrato nella pagina
    document.getElementById('cityprompt').focus();
    document.getElementById('cityprompt').select();
    if (cittàprecedente != null) {
        var p = document.createElement('p')
        var button = document.createElement('button')
        p.innerText = "Hai cercato recentemente: "
        button.innerText = cittàprecedente
        button.setAttribute('onclick', 'document.getElementById(\'cityprompt\').value=' + "\"" + cittàprecedente + "\"")
        p.appendChild(button)
        div.appendChild(p)
    }
}

export {spawnPaginaLuogo}