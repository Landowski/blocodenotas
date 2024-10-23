// Configurações do app no Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBO_nBQg70L-WOby_UDOJc6bt3Yg3I7-Qk",
    authDomain: "bloco-de-notas-b94c4.firebaseapp.com",
    projectId: "bloco-de-notas-b94c4",
    storageBucket: "bloco-de-notas-b94c4.appspot.com",
    messagingSenderId: "515098342854",
    appId: "1:515098342854:web:4b91c903046400c7f96ec7"
  };

// Inicia o Firebase
firebase.initializeApp(firebaseConfig);

// Declarações
const logo = document.querySelector(".logo");
const notesList = document.getElementById("notes-list");
const loadingMessage = document.getElementById("loading-message");
const addNoteButton = document.getElementById("add");
const noteDetails = document.getElementById("note-details");
const noteTitle = document.getElementById("note-title");
const noteBody = document.getElementById("note-body");
const formatacao = document.getElementById('formatacao');
const boldBtn = document.getElementById('boldBtn');
const italicBtn = document.getElementById('italicBtn');
const underlineBtn = document.getElementById('underlineBtn');
const leftBtn = document.getElementById('leftBtn');
const centerBtn = document.getElementById('centerBtn');
const rightBtn = document.getElementById('rightBtn');
const justifyBtn = document.getElementById('justifyBtn');
const markerBtn = document.getElementById('markerBtn');
const listOrderBtn = document.getElementById('listOrderBtn');
const listBtn = document.getElementById('listBtn');
const linkBtn = document.getElementById('linkBtn');
const removeBtn = document.getElementById('removeBtn');
const deleteConfirmation = document.getElementById("delete-confirmation");
const confirmDeleteButton = document.getElementById("confirm-delete");
const cancelDeleteButton = document.getElementById("cancel-delete");
const noteToDeleteSpan = document.getElementById("note-to-delete");
const home = document.getElementById("home");
const toggleDark = document.getElementById("dark-mode");
const menu = document.getElementById("menu");
const overlaySidebar = document.getElementById("overlay-sidebar");
const todoInput = document.getElementById("input-to-do");
const todoList = document.getElementById("to-do");
const loginBtn = document.getElementById("loginBtn");
const loginPopup = document.getElementById("login-popup");
const popLogin = document.getElementById('popLogin');
const popSignUp = document.getElementById('popSignUp');
const loginLink = document.querySelector('#linkLogin');
const signupLink = document.querySelector('#linkSignUp');
const toggleLogin = document.getElementById('btnToggleLogin');
const toggleSignUp = document.getElementById('btnToggleSignUp');
const toggleVerify = document.getElementById('btnToggleVerify');
let notes = [];
let currentNoteId = null;

// Listeners iniciais
menu.addEventListener('click', toggleSidebar);
signupLink.addEventListener('click', showLogin);
loginLink.addEventListener('click', showSignUp);
toggleLogin.addEventListener('click', passwordLogin);
toggleSignUp.addEventListener('click', passwordSignUp);
toggleVerify.addEventListener('click', passwordVerify);
overlaySidebar.addEventListener('click', toggleSidebar);
loginPopup.addEventListener('click', function(event) {
    if (event.target === loginPopup) {
        popupLogin();
    }
});

let loginBtnClicked = false;
loginBtn.addEventListener('click', function() {
    loginBtnClicked = true;
    firebase.auth().onAuthStateChanged((user) => {
        if (user && loginBtnClicked) { 
            window.location.href = 'app';
        } else if (!user) {
            loginPopup.classList.toggle('hidden');
            document.getElementById('login-form').reset();
            document.getElementById('login-form-sign-up').reset();
            showLogin();
        }
        loginBtnClicked = false;
    });
});

todoInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const todoText = todoInput.value.trim();
        if (todoText !== "") {
            addTodo(todoText);
            todoInput.value = "";
        }
    }
});

toggleDark.addEventListener("click", () => {
    if (document.body.classList.contains('light-mode')) {
        applyDarkMode();
        localStorage.setItem('theme', 'dark-mode');
    } else {
        applyLightMode();
        localStorage.setItem('theme', 'light-mode');
    }
});

logo.addEventListener("click", () => {
    if (currentNoteId) {
        saveNote();
    }
    noteDetails.classList.add("hidden");
    home.classList.remove("hidden");
    const selectedNote = notesList.querySelector(".selected-note");
    if (selectedNote) {
        selectedNote.classList.remove("selected-note");
    }
    currentNoteId = null;
});

// Início do local storage
function initializeLocalStorage() {
    if (!localStorage.getItem('notes')) {
      localStorage.setItem('notes', JSON.stringify([]));
    }
    if (!localStorage.getItem('todos')) {
      localStorage.setItem('todos', JSON.stringify([]));
    }
    syncNotes();
}

function syncNotes() {
    notes = JSON.parse(localStorage.getItem('notes')) || [];
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function applyStoredTheme() {
    const storedMode = localStorage.getItem('theme');
    if (storedMode === 'dark-mode') {
        applyDarkMode();
    } else {
        applyLightMode();
    }
}

// Lista de tarefas
function addTodo(text) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const newOrder = todos.length > 0 ? Math.max(...todos.map(t => t.ordem)) + 1 : 0;
    const newTodo = {
      id: Date.now().toString(),
      item: text,
      ordem: newOrder
    };
    todos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(todos));
    loadTodos();
}           

function loadTodos() {
    todoList.innerHTML = "";
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.sort((a, b) => a.ordem - b.ordem).forEach((todoItem) => {
        const todoElement = document.createElement("div");
        todoElement.className = "to-do " + (document.body.classList.contains("light-mode") ? "light-mode" : "dark-mode");
        todoElement.dataset.id = todoItem.id;
        const textDecoration = todoItem.done ? "text-decoration: line-through;" : "";
        const checkIcon = todoItem.done ? `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-check-circle" width="19" height="19" viewBox="0 0 24 24" fill="currentColor" class="checkToDo checked" data-id="${todoItem.id}"><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-circle-outline" width="19" height="19" viewBox="0 0 24 24" fill="currentColor" class="checkToDo notChecked" data-id="${todoItem.id}"><path d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>`; 
        
        todoElement.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-drag" width="21" height="21" viewBox="0 0 24 24" fill="currentColor" class="dragIcon"><path d="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z"/></svg>
            <span style="width: 100%; ${textDecoration}">${todoItem.item}</span>
            <div class="toDoButtons">
            ${checkIcon}
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-trash-can-outline" width="19" height="19" viewBox="0 0 24 24" fill="currentColor" class="deleteToDo" data-id="${todoItem.id}"><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"/></svg>
            </div>
        `;

        todoList.appendChild(todoElement);
        
        todoElement.querySelector(".deleteToDo").addEventListener("click", function() {
            const todoId = this.getAttribute("data-id");
            deleteTodo(todoId);
        });

        todoElement.querySelector(".checkToDo").addEventListener("click", function() {
            const todoId = this.getAttribute("data-id");
            checkTodo(todoId);
        });
    });

    new Sortable(todoList, {
        handle: '.dragIcon',
        animation: 150,
        onStart: function(evt) {
            const todos = todoList.querySelectorAll('.to-do');
            todos.forEach((todo, index) => {
                if (index !== evt.oldIndex) {
                    todo.classList.add('faded');
                }
            });
        },
        onEnd: function(evt) {
            const todos = todoList.querySelectorAll('.to-do');
            todos.forEach((todo) => {
                todo.classList.remove('faded');
            });
            updateTodoOrder();
        }
    });
}

function updateTodoOrder() {
    const todoElements = todoList.querySelectorAll('.to-do');
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todoElements.forEach((todoElement, index) => {
      const todoId = todoElement.dataset.id;
      const todo = todos.find(t => t.id === todoId);
      if (todo) {
        todo.ordem = index;
      }
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}         

function deleteTodo(todoId) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.filter(todo => todo.id !== todoId);
    localStorage.setItem('todos', JSON.stringify(todos));
    loadTodos();
}

function checkTodo(todoId) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.map(todo => {
        if (todo.id === todoId) {
            todo.done = !todo.done;
        }
        return todo;
    });
    localStorage.setItem('todos', JSON.stringify(todos));
    loadTodos();
}

// Dark mode
function applyDarkMode() {
    const items = document.querySelectorAll('#sidebar ul li');
    const botoes = document.querySelectorAll('.note-actions button');
    const toDoText = document.querySelectorAll('.to-do');
    const botaoDark = document.getElementById('dark-mode');
    const h3 = document.getElementById('h3');
    const h32 = document.getElementById('h3-2');
    const sidebar = document.getElementById('sidebar');
    const insertToDo = document.querySelector(".insertToDo");
    const notebody = document.getElementById('note-body');
    const textEditor = document.getElementById('text-editor');
    const sobre = document.getElementById('sobre');
    
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    notebody.classList.remove('light-mode');
    notebody.classList.add('dark-mode');
    insertToDo.classList.remove('light-mode');
    insertToDo.classList.add('dark-mode');
    textEditor.classList.remove('light-mode');
    textEditor.classList.add('dark-mode');
    sidebar.classList.remove('light-mode');
    sidebar.classList.add('dark-mode');
    noteDetails.classList.remove('light-mode');
    noteDetails.classList.add('dark-mode');
    botaoDark.classList.remove('light-mode');
    botaoDark.classList.add('dark-mode');
    menu.classList.remove('light-mode');
    menu.classList.add('dark-mode');
   sobre.classList.remove('light-mode');
   sobre.classList.add('dark-mode');
    h3.style.color = "#DBDBDB";
    h32.style.color = "#DBDBDB";
    items.forEach(item => {
        item.classList.remove('light-mode');
        item.classList.add('dark-mode');
    });
    botoes.forEach(item => {
        item.classList.remove('light-mode');
        item.classList.add('dark-mode');
    });
    toDoText.forEach(item => {
        item.classList.remove('light-mode');
        item.classList.add('dark-mode');
    });
}

function applyLightMode() {
    const items = document.querySelectorAll('#sidebar ul li');
    const botoes = document.querySelectorAll('.note-actions button');
    const toDoText = document.querySelectorAll('.to-do');
    const botaoDark = document.getElementById('dark-mode');
    const h3 = document.getElementById('h3');
    const h32 = document.getElementById('h3-2');
    const sidebar = document.getElementById('sidebar');
    const insertToDo = document.querySelector(".insertToDo");
    const notebody = document.getElementById('note-body');
    const textEditor = document.getElementById('text-editor');
    const sobre = document.getElementById('sobre');
    
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    notebody.classList.remove('dark-mode');
    notebody.classList.add('light-mode');
    insertToDo.classList.remove('dark-mode');
    insertToDo.classList.add('light-mode');
    textEditor.classList.remove('dark-mode');
    textEditor.classList.add('light-mode');
    sidebar.classList.remove('dark-mode');
    sidebar.classList.add('light-mode');
    noteDetails.classList.remove('dark-mode');
    noteDetails.classList.add('light-mode');
    botaoDark.classList.remove('dark-mode');
    botaoDark.classList.add('light-mode');
    menu.classList.remove('dark-mode');
    menu.classList.add('light-mode');
   sobre.classList.remove('dark-mode');
   sobre.classList.add('light-mode');
    h3.style.color = "#111";
    h32.style.color = "#111";
    items.forEach(item => {
        item.classList.remove('dark-mode');
        item.classList.add('light-mode');
    });
    botoes.forEach(item => {
        item.classList.remove('dark-mode');
        item.classList.add('light-mode');
    });
    toDoText.forEach(item => {
        item.classList.remove('dark-mode');
        item.classList.add('light-mode');
    });
}


// CRUD das notas
function renderNotesList() {
    notes.sort((a, b) => (a.order || 0) - (b.order || 0));
    notesList.innerHTML = "";
    
    notes.forEach(note => {
        const li = document.createElement("li");
        li.innerHTML = `
        <div class="dragAndSpan">
            <div class="dragNote">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-drag" width="21" height="21" viewBox="0 0 24 24" fill="currentColor"><path d="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z" /></svg>
            </div>
                <span>${note.title || "Bloco de notas"}</span>
        </div>
        <div class="note-actions">
            <button class="delete-note light-mode" title="Excluir nota"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-trash-can-outline" width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"/></svg></button>
        </div>`;
        li.dataset.id = note.id;

        const deleteButton = li.querySelector('.delete-note');
        deleteButton.addEventListener("click", (event) => {
            event.stopPropagation();
            deleteNote(note.id);
        });

        li.addEventListener("click", () => selectNote(note.id));

        if (note.id === currentNoteId) {
            li.classList.add("selected-note");
        }

        notesList.appendChild(li);
    });

    const items = document.querySelectorAll('#sidebar ul li');
    if (document.body.classList.contains('light-mode')) {
        items.forEach(item => {
            item.classList.add('light-mode');
        });
    } else {
        items.forEach(item => {
            item.classList.add('dark-mode');
        });
    }

    initializeSidebarSortable();
}

function deleteNote(id) {
    const note = notes.find(n => n.id === id);
    if (note) {
        noteToDeleteSpan.textContent = note.title || "Novo bloco";
        deleteConfirmation.classList.remove("hidden");
        currentNoteId = id;
    }
}

function initializeSidebarSortable() {
    new Sortable(notesList, {
        animation: 150,
        handle: 'svg',
        ghostClass: 'sortable-ghost',
        onStart: function(evt) {
            const notes = notesList.querySelectorAll('li');
            notes.forEach((note, index) => {
                if (index !== evt.oldIndex) {
                    note.classList.add('faded');
                }
            });
        },
        onEnd: function(evt) {
            const notes = notesList.querySelectorAll('li');
            notes.forEach((note) => {
                note.classList.remove('faded');
            });
            updateNotesOrder();
        }
    });
}

function updateNotesOrder() {
    const noteElements = notesList.querySelectorAll('li');
    notes = Array.from(noteElements).map((el, index) => {
        const note = notes.find(note => note.id === el.dataset.id);
        return { ...note, order: index };
    });
    saveNotes();
}

function selectNote(id) {
    currentNoteId = id;
    const note = notes.find(n => n.id === id);
    if (note) {
        noteTitle.value = note.title || '';
        noteBody.innerHTML = note.body || '';
        home.classList.add("hidden");
        noteDetails.classList.remove("hidden");

        const selectedNote = notesList.querySelector(".selected-note");
        if (selectedNote) {
            selectedNote.classList.remove("selected-note");
        }

        const li = notesList.querySelector(`li[data-id="${id}"]`);
        if (li) {
            li.classList.add("selected-note");
        }
    }
}

function saveNote() {
    const note = {
        id: currentNoteId,
        title: noteTitle.value,
        body: noteBody.innerHTML
    };
    const index = notes.findIndex(n => n.id === note.id);
    if (index !== -1) {
        notes[index] = note;
    } else {
        notes.push(note);
    }
    saveNotes();
    renderNotesList();
}

noteTitle.addEventListener("input", saveNote);
noteBody.addEventListener("blur", saveNote);
noteBody.addEventListener('paste', function(e) {
    e.preventDefault();
    let text = (e.originalEvent || e).clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
});

function addNote() {
    const newNote = {
        id: Date.now().toString(),
        title: "Novo bloco",
        body: "",
        order: notes.length
    };
    notes.push(newNote);
    currentNoteId = newNote.id;
    saveNotes();
    renderNotesList();
    selectNote(newNote.id);
}

addNoteButton.addEventListener("click", addNote);

confirmDeleteButton.addEventListener("click", () => {
    notes = notes.filter(note => note.id !== currentNoteId);
    saveNotes();
    currentNoteId = null;
    deleteConfirmation.classList.add("hidden");
    noteDetails.classList.add("hidden");
    home.classList.remove("hidden");
    renderNotesList();
});

cancelDeleteButton.addEventListener("click", () => {
    deleteConfirmation.classList.add("hidden");
});


// Menu de seleção
noteBody.addEventListener('mouseup', function(event) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().length > 0) {
        savedSelection = selection.getRangeAt(0);
        const range = savedSelection.cloneRange();
        range.collapse(false);
        const span = document.createElement('span');
        range.insertNode(span);
        const rect = span.getBoundingClientRect();
        span.parentNode.removeChild(span);
        selection.removeAllRanges();
        selection.addRange(savedSelection);
        formatacao.style.left = `${rect.left + window.scrollX}px`;
        formatacao.style.top = `${rect.top - 30 + window.scrollY - formatacao.offsetHeight}px`;
        formatacao.style.display = 'flex';
    } else {
        formatacao.style.display = 'none';
    }
});

document.addEventListener('click', function(event) {
    if (!noteBody.contains(event.target) && !formatacao.contains(event.target)) {
        formatacao.style.display = 'none';
    }
});

function restoreSelectionAndApplyCommand(command, value = null) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedSelection);
    document.execCommand(command, false, value);
    formatacao.style.display = 'none';
}

boldBtn.addEventListener('click', function() {
    restoreSelectionAndApplyCommand('bold');
});

italicBtn.addEventListener('click', function() {
    restoreSelectionAndApplyCommand('italic');
});

underlineBtn.addEventListener('click', function() {
    restoreSelectionAndApplyCommand('underline');
});

leftBtn.addEventListener('click', function() {
    restoreSelectionAndApplyCommand('justifyLeft');
});

centerBtn.addEventListener('click', function() {
    restoreSelectionAndApplyCommand('justifyCenter');
});

rightBtn.addEventListener('click', function() {
    restoreSelectionAndApplyCommand('justifyRight');
});

justifyBtn.addEventListener('click', function() {
    restoreSelectionAndApplyCommand('justifyFull');
});

listOrderBtn.addEventListener('click', function() {
    restoreSelectionAndApplyCommand('insertOrderedList');
});

listBtn.addEventListener('click', function() {
    restoreSelectionAndApplyCommand('insertUnorderedList');
});

linkBtn.addEventListener('click', function() {
    const range = saveSelection();
    const url = prompt('Insira o link', 'https://');
    if (url) {
        noteBody.focus();
        restoreSelection(range);
        
        document.execCommand('createLink', false, url);
        
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const linkElement = selection.anchorNode.parentElement;
            if (linkElement.tagName === 'A') {
                linkElement.setAttribute('contenteditable', 'false');
                linkElement.setAttribute('target', '_blank');
            }
        }
    }
});

markerBtn.addEventListener('click', function() {
    restoreSelectionAndApplyCommand('hiliteColor', 'yellow');
});

removeBtn.addEventListener('click', function() {
    restoreSelectionAndApplyCommand('removeFormat');
});

function saveSelection() {
    const selection = getSelection();
    if (selection.rangeCount > 0) {
        return selection.getRangeAt(0);
    }
    return null;
}

function restoreSelection(range) {
    if (range) {
        const selection = getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

// Menu lateral e fundo de popup
function toggleSidebar(){
    document.getElementById("sidebar").classList.toggle('active');
    overlaySidebar.classList.toggle('active');
}

// Login e Cadastro
function popupLogin() {
    firebase.auth().onAuthStateChanged((user) => {
            loginPopup.classList.toggle('hidden');
            document.getElementById('login-form').reset();
            document.getElementById('login-form-sign-up').reset();
            showLogin();
    });
}

function showSignUp() {
    popSignUp.style.display = 'flex';
    popLogin.style.display = 'none';
    toggleSignUp.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-eye-outline" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z"/></svg>`;
    toggleVerify.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-eye-outline" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z"/></svg>`;
}

function showLogin() {
    popSignUp.style.display = 'none';
    popLogin.style.display = 'flex';
    toggleLogin.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-eye-outline" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z"/></svg>`;
}

function passwordLogin() {
  let passLogin = document.getElementById("login-password");
    if (passLogin.type === "password") {
        passLogin.type = "text";
        toggleLogin.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-eye-off-outline" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z"/></svg>`;
    } else {
        passLogin.type = "password";
        toggleLogin.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-eye-outline" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z"/></svg>`;
    }
}

function passwordSignUp() {
  let passSignUp = document.getElementById("signup-password");
    if (passSignUp.type === "password") {
        passSignUp.type = "text";
        toggleSignUp.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-eye-off-outline" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z"/></svg>`;
    } else {
        passSignUp.type = "password";
        toggleSignUp.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-eye-outline" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z"/></svg>`;
    }
}

function passwordVerify() {
  let passVerify = document.getElementById("signup-password-verify");
    if (passVerify.type === "password") {
      passVerify.type = "text";
      toggleVerify.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-eye-off-outline" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z"/></svg>`;
    } else {
      passVerify.type = "password";
      toggleVerify.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-eye-outline" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z"/></svg>`;
    }
}

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const botaoLogin = document.getElementById('botaoLogin');
            botaoLogin.disabled = 'true';
            botaoLogin.style.opacity = '0.5';
            const userId = userCredential.user.uid;
            return firebase.firestore().collection('usuario').doc(userId).update({
                ultimo_login: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            window.location.href = 'app';
        })
        .catch((error) => {
        switch (error.code) {
            case "auth/internal-error":
            alert("E-mail ou senha inválidos.");
            break;
        }
    });
});

document.getElementById('login-form-sign-up').addEventListener('submit', function(event) {
event.preventDefault();
var email = document.getElementById('signup-email').value;
var password = document.getElementById('signup-password').value;
var confirmPassword = document.getElementById('signup-password-verify').value;

if (password !== confirmPassword) {
    alert('As senhas não são iguais.');
    return;
}

if (password.length < 8) {
    alert('A senha precisa ter 8 caracteres no mínimo.');
    return;
}

const db = firebase.firestore();

firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        const botaoCadastro = document.getElementById('botaoCadastro');
        botaoCadastro.disabled = 'true';
        botaoCadastro.style.opacity = '0.5';
        const user = userCredential.user;

        const userData = {
            assinante: false,
            email: user.email,
            id_unico: user.uid,
            registro: firebase.firestore.FieldValue.serverTimestamp(),
            ultimo_login: firebase.firestore.FieldValue.serverTimestamp(),
            modo_escuro: false,
            nome: document.getElementById('signup-name').value
        };

        return db.collection('usuario').doc(user.uid).set(userData);
    })
    .then(() => {
        window.location.href = 'app';
    })
    .catch((error) => {
        if (error.code) {
            console.error("Auth error:", error);
            switch (error.code) {
                case "auth/email-already-in-use":
                    alert("Este e-mail já está registrado.");
                    break;
                default:
                    alert("Erro de registro: " + error.message);
            }
        }
    });
});

// Inicialização
applyStoredTheme();
initializeLocalStorage();
renderNotesList();
loadTodos();
initializeSidebarSortable();
loadingMessage.style.display = "none";
