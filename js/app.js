let darkMode = 0;
let currentSize = "M";
let characterCounter = document.getElementById("char_count");
let wordCount = document.getElementById("word_count");
const body = document.body;
const barra = document.getElementById("barra-up");
const toggleThemeButton = document.getElementById('toggle-theme');
const copyButton = document.getElementById('copy-text');
const saveStorage = document.getElementById('save-storage');
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
const elements = document.querySelector('.elements');
const help = document.getElementById('ajuda');
const overlay = document.getElementById('overlay');
const okPopup = document.getElementById('okPopup');

function toggleTheme() {
    if (darkMode === 1) {
        body.style.backgroundColor = "#f5f5f5"
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
        buttonLight();
        darkMode = 0;
        localStorage.setItem('theme', 'light');
    } else {
        body.style.backgroundColor = "#111"
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
        buttonDark();
        darkMode = 1;
        localStorage.setItem('theme', 'dark');
    }
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        if (savedTheme === 'dark') {
            darkMode = 0;
        } else {
            darkMode = 1;
        }
        toggleTheme();
    }
}

function toggleSize() {
    if (currentSize === "M") {
        currentSize = "G";
        textEditor.style.fontSize = "19px";
    } else if (currentSize === "G") {
        currentSize = "P";
        textEditor.style.fontSize = "12px";
    } else {
        currentSize = "M";
        textEditor.style.fontSize = "15px";
    }
    localStorage.setItem('textSize', currentSize);
}

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
    }
}

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

clearEditorButton.addEventListener('click', clearTextArea);

toggleThemeButton.addEventListener('click', toggleTheme);

toggleSizeButton.addEventListener('click', toggleSize);

function Notify(texto) {
    let div = document.createElement('div');
    div.id = 'noti';
    div.innerHTML = texto;
    document.body.appendChild(div);
    const copyButtonRect = copyButton.getBoundingClientRect();
    div.style.top = `${copyButtonRect.top - div.offsetHeight - 10}px`;
    div.style.left = `${copyButtonRect.left + (copyButtonRect.width / 2) - (div.offsetWidth / 2)}px`;
    div.style.visibility = 'visible';
    div.style.opacity = 1;
    setTimeout(function() {
        document.body.removeChild(div);
    }, 2500);
}

copyButton.addEventListener('click', () => {
    textEditor.select();
    textEditor.setSelectionRange(0, 99999);
    document.execCommand('copy');
    Notify('👍');
});

textEditor.addEventListener("blur", () => {
    const text = textEditor.value;
    localStorage.setItem('textEditorContent', text);
});

function clearTextArea() {
    textEditor.value = "";
    localStorage.removeItem('textEditorContent');
    characterCounter.textContent = 0;
    wordCount.textContent = 0;
}

textEditor.addEventListener("input", () => {
    characterCounter.textContent = textEditor.value.length;
    let txt = textEditor.value.trim();
    wordCount.textContent = txt.split(/\s+/).filter((item) => item).length;
});

function buttonLight() {
    for (var i = 0; i < button.length; ++i) {
        button[i].classList.remove('bdark');
        button[i].classList.add('blight');
    }
}

function buttonDark() {
    for (var i = 0; i < button.length; ++i) {
        button[i].classList.remove('blight');
        button[i].classList.add('bdark');
    }
}

function adjustTextareaHeight() {
    // Define a altura da textarea como a altura disponível na div
    textEditor.style.height = `${elements.clientHeight - textEditor.offsetTop}px`;
}
const resizeObserver = new ResizeObserver(adjustTextareaHeight);
resizeObserver.observe(elements);
adjustTextareaHeight();

help.addEventListener('click', popup);
    overlay.addEventListener('click', function(event) {
        if (event.target === overlay) {
            popup();
        }
});
okPopup.addEventListener('click', function(event) {
    event.stopPropagation();
    popup();
});

function popup() {
    overlay.classList.toggle('active');
}
