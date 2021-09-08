//Listener al bottone di cambio tema
document.getElementById('themeswitch').addEventListener('click', cambiaTema)

//Richiesta di cambio tema, cambia lo stylesheet in base al tema attuale
function cambiaTema() {
    savedtheme = localStorage.getItem("tema");
    switchbutton = document.getElementById('themeswitch');
    stylefile = document.getElementById('stylesheet')
    switch (savedtheme) {
        case 'on':
            stylefile.href = "/stylesheets/dark-style.css"
            switchbutton.innerHTML = '🌑';
            localStorage.setItem('tema', 'off')
            break;
        case 'off':
            stylefile.href = "/stylesheets/light-style.css"
            switchbutton.innerHTML = '☀️';
            localStorage.setItem('tema', 'on')
            break;
    }
}

//Recupera da localstorage l'ultimo tema utilizzato, di default viene utilizzato il tema bianco
function inizializzaTema() {
    switchbutton = document.getElementById('themeswitch');
    savedtheme = localStorage.getItem("tema");
    stylefile = document.getElementById('stylesheet')
    if (savedtheme == null) {
        savedtheme = 'on'
        localStorage.setItem('tema', 'on')
    }
    switch (savedtheme) {
        case 'on':
            stylefile.href = "/stylesheets/light-style.css"
            switchbutton.innerHTML = '☀️';
            break;
        case 'off':
            stylefile.href = "/stylesheets/dark-style.css"
            switchbutton.innerHTML = '🌑';
            break;
    }
}

inizializzaTema()