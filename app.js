let darkMode = 0;
let currentSize = "M"; // Tamanho padrão: Médio (M)
let characterCounter = document.getElementById("char_count");
let wordCount = document.getElementById("word_count");
const body = document.body;
const barra = document.getElementById("barra-up");
const toggleThemeButton = document.getElementById('toggle-theme');
const copyButton = document.getElementById('copy-text');
const saveStorage = document.getElementById('save-storage');
const deleteStorage = document.getElementById('delete-storage');
const clearEditorButton = document.getElementById('clear-editor');
const toggleSizeButton = document.getElementById('toggle-size');
const textEditor = document.getElementById('text-editor');
const h1 = document.getElementById('h1');
const h2 = document.getElementById('h2');
const h2_2 = document.getElementById('h2-2');
const privacidade = document.getElementById('privacidade');
const button = document.querySelectorAll('.button')
const tamanhoSpan = document.getElementById('tamanho');
const helpElements = document.querySelectorAll('.help');
const aboutElements = document.querySelectorAll('.about');

// Função para alternar o tema
function toggleTheme() {
    if (darkMode === 1) {
        body.style.backgroundColor = "#FFF"
        textEditor.classList.remove('dark');
        textEditor.classList.add('light');
        barra.classList.remove('dark');
        privacidade.classList.remove('dark');
        barra.classList.add('light');
        privacidade.classList.add('light');
        h1.classList.remove('dark');
        h2.classList.remove('dark');
        h2_2.classList.remove('dark');
        h1.classList.add('light');
        h2.classList.add('light');
        h2_2.classList.add('light');
        helpElements.forEach(el => {
            el.classList.remove('dark');
            el.classList.add('light');
        });
        aboutElements.forEach(el => {
            el.classList.remove('dark');
            el.classList.add('light');
        });
        buttonLight();
        toggleThemeButton.innerHTML = '<i class="lar la-moon"></i>Noite';
        darkMode = 0;
        localStorage.setItem('theme', 'light');
    } else {
        body.style.backgroundColor = "#222"
        textEditor.classList.remove('light');
        textEditor.classList.add('dark');
        barra.classList.remove('light');
        privacidade.classList.remove('light');
        barra.classList.add('dark');
        privacidade.classList.add('dark');
        h1.classList.remove('light');
        h2.classList.remove('light');
        h2_2.classList.remove('light');
        h1.classList.add('dark');
        h2.classList.add('dark');
        h2_2.classList.add('dark');
        helpElements.forEach(el => {
            el.classList.remove('light');
            el.classList.add('dark');
        });
        aboutElements.forEach(el => {
            el.classList.remove('light');
            el.classList.add('dark');
        });
        buttonDark();
        toggleThemeButton.innerHTML = '<i class="lar la-sun"></i>Dia';
        darkMode = 1;
        localStorage.setItem('theme', 'dark');
    }
}

// Função para aplicar o tema salvo
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        if (savedTheme === 'dark') {
            darkMode = 0;
        } else {
            darkMode = 1;
        }
        toggleTheme(); // Chama a função para aplicar o tema salvo
    }
}

// Função para alternar o tamanho do texto
function toggleSize() {
    if (currentSize === "M") {
        currentSize = "G";
        textEditor.style.fontSize = "18px";
    } else if (currentSize === "G") {
        currentSize = "P";
        textEditor.style.fontSize = "13px";
    } else {
        currentSize = "M";
        textEditor.style.fontSize = "15px";
    }
    tamanhoSpan.textContent = currentSize;
    localStorage.setItem('textSize', currentSize);
}

// Função para aplicar o tamanho do texto salvo
function applySavedSize() {
    const savedSize = localStorage.getItem('textSize');
    if (savedSize) {
        currentSize = savedSize;
        if (currentSize === "M") {
            textEditor.style.fontSize = "15px";
        } else if (currentSize === "G") {
            textEditor.style.fontSize = "18px";
        } else if (currentSize === "P") {
            textEditor.style.fontSize = "13px";
        }
        tamanhoSpan.textContent = currentSize;
    }
}

// Carregar configurações do localStorage ao carregar a página
window.addEventListener('load', () => {
    const savedText = localStorage.getItem('textEditorContent');

    if (savedText) {
        textEditor.value = savedText;
        characterCounter.textContent = textEditor.value.length;
        let txt = textEditor.value.trim();
        wordCount.textContent = txt.split(/\s+/).filter((item) => item).length;
    }

    applySavedTheme();
    applySavedSize();
});

// Evento para alternar o tema
toggleThemeButton.addEventListener('click', toggleTheme);

// Evento para alternar o tamanho do texto
toggleSizeButton.addEventListener('click', toggleSize);

// Função para notificação da cópia de texto
function Notify(texto) {
    let div = document.createElement('div');
    div.innerHTML = `<div id="noti">${texto}</span></div>`;
    document.getElementsByTagName('body')[0].appendChild(div);
    var x = document.getElementById("noti");
        if (darkMode === 0) {
            x.className = "show-light";
        } else {
            x.className = "show-dark";
        }
    setTimeout(function(){ document.getElementsByTagName('body')[0].removeChild(div); }, 4000);
}

// Evento para copiar o texto
copyButton.addEventListener('click', () => {
    textEditor.select();
    textEditor.setSelectionRange(0, 99999);
    document.execCommand('copy');
    Notify('Texto copiado');
});

// Evento para salvar o conteúdo no localStorage
saveStorage.addEventListener('click', () => {
    const text = textEditor.value;
    localStorage.setItem('textEditorContent', text);
    Notify('Texto gravado');
});

// Evento para limpar o localStorage
deleteStorage.addEventListener('click', () => {
    localStorage.removeItem('textEditorContent');
    Notify('Texto deletado');
});

// Evento para limpar o editor
clearEditorButton.addEventListener('click', () => {
    textEditor.value = '';
    characterCounter.textContent = '0';
    wordCount.textContent = '0';
});

// Evento para contar os caracteres
textEditor.addEventListener("input", () => {
    characterCounter.textContent = textEditor.value.length;
    let txt = textEditor.value.trim();
    wordCount.textContent = txt.split(/\s+/).filter((item) => item).length;
});

// Função para modo light
function buttonLight() {
    for (var i = 0; i < button.length; ++i) {
        button[i].classList.remove('bdark');
        button[i].classList.add('blight');
    }
}

// Função para modo dark
function buttonDark() {
    for (var i = 0; i < button.length; ++i) {
        button[i].classList.remove('blight');
        button[i].classList.add('bdark');
    }
}