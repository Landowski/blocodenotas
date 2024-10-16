
const logo = document.querySelector(".logo");
const notesList = document.getElementById("notes-list");
const loadingMessage = document.getElementById("loading-message");
const addNoteButton = document.getElementById("add");
const noteDetails = document.getElementById("note-details");
const noteTitle = document.getElementById("note-title");
const noteBody = document.getElementById("note-body");
const deleteNoteButton = document.getElementById("delete-note");
const deleteConfirmation = document.getElementById("delete-confirmation");
const confirmDeleteButton = document.getElementById("confirm-delete");
const cancelDeleteButton = document.getElementById("cancel-delete");
const noteToDeleteSpan = document.getElementById("note-to-delete");
const home = document.getElementById("home");
const toggleDark = document.getElementById("dark-mode");
const menu = document.getElementById("menu");
const overlay = document.getElementById("overlay");
const todoInput = document.getElementById("input-to-do");
const todoList = document.getElementById("to-do");
let notes = [];
let currentNoteId = null;

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

menu.addEventListener('click', toggleSidebar);
overlay.addEventListener('click', toggleSidebar);

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
    location.reload();
});

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
    toggleApagarTodos();
}           

function loadTodos() {
    todoList.innerHTML = "";
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.sort((a, b) => a.ordem - b.ordem).forEach((todoItem) => {
        const todoElement = document.createElement("div");
        todoElement.className = "to-do " + (document.body.classList.contains("light-mode") ? "light-mode" : "dark-mode");
        todoElement.dataset.id = todoItem.id;
        const textDecoration = todoItem.done ? "text-decoration: line-through;" : "";
        const checkColor = todoItem.done ? "color: limegreen;" : "color: inherit;";
        
        todoElement.innerHTML = `
            <i class="las la-grip-lines dragIcon"></i>
            <span style="width: 100%; ${textDecoration}">${todoItem.item}</span>
            <div style="display: flex;">
            <i class="las la-check-circle checkToDo" style="font-size: 20px; ${checkColor}" data-id="${todoItem.id}"></i>
            <i class="las la-trash-alt deleteToDo" style="font-size: 20px;" data-id="${todoItem.id}"></i>
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
    toggleApagarTodos();
}

function checkTodo(todoId) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.map(todo => {
        if (todo.id === todoId) {
            todo.done = !todo.done; // Alterna o estado de "done"
        }
        return todo;
    });
    localStorage.setItem('todos', JSON.stringify(todos)); // Salva a alteração no localStorage
    loadTodos(); // Recarrega os to-dos para refletir as mudanças
}

document.getElementById("apagar-todos").addEventListener("click", function() {
    localStorage.setItem('todos', JSON.stringify([]));
    loadTodos();
    toggleApagarTodos();
});

function toggleApagarTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const apagarTodosBtn = document.getElementById("apagar-todos");
    if (todos.length > 1) {
        apagarTodosBtn.style.display = "flex";

    } else {
        apagarTodosBtn.style.display = "none";
    }
}

function applyDarkMode() {
    const items = document.querySelectorAll('#sidebar ul li');
    const botoes = document.querySelectorAll('.note-actions button');
    const toDoText = document.querySelectorAll('.to-do');
    const botaoDark = document.getElementById('dark-mode');
    const h3 = document.getElementById('h3');
    const h32 = document.getElementById('h3-2');
    const sidebar = document.getElementById('sidebar');
    const insertToDo = document.querySelector(".insertToDo");
    const apagarTodos = document.getElementById('apagar-todos');
    const notebody = document.getElementById('note-body');
    const textEditor = document.getElementById('text-editor');
    
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    notebody.classList.remove('light-mode');
    notebody.classList.add('dark-mode');
    insertToDo.classList.remove('light-mode');
    insertToDo.classList.add('dark-mode');
    apagarTodos.classList.remove('light-mode');
    apagarTodos.classList.add('dark-mode');
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
    const apagarTodos = document.getElementById('apagar-todos');
    const notebody = document.getElementById('note-body');
    const textEditor = document.getElementById('text-editor');
    
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    notebody.classList.remove('dark-mode');
    notebody.classList.add('light-mode');
    insertToDo.classList.remove('dark-mode');
    insertToDo.classList.add('light-mode');
    apagarTodos.classList.remove('dark-mode');
    apagarTodos.classList.add('light-mode');
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

function renderNotesList() {
    notesList.innerHTML = "";
    const sortedNotes = notes.sort((a, b) => (a.title || "").localeCompare(b.title || ""));

    sortedNotes.forEach(note => {
      const li = document.createElement("li");
      li.innerHTML = `<i class="las la-grip-lines dragBloco"></i> ${note.title || "Bloco de notas"}`;
      li.dataset.id = note.id;

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

noteTitle.addEventListener("blur", saveNote);
noteBody.addEventListener("blur", saveNote);

function addNote() {
    const newNote = {
        id: Date.now().toString(),
        title: "Novo bloco",
        body: ""
    };
    notes.push(newNote);
    currentNoteId = newNote.id;
    saveNotes();
    renderNotesList();
    selectNote(newNote.id);
}

addNoteButton.addEventListener("click", addNote);

deleteNoteButton.addEventListener("click", () => {
    const note = notes.find(n => n.id === currentNoteId);
    if (note) {
      noteToDeleteSpan.textContent = note.title || "Novo bloco";
      deleteConfirmation.classList.remove("hidden");
    }
});

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

function getSelection() {
    return window.getSelection();
}

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

function toggleLink() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        const url = prompt('Insira o link', 'https://');
        if (url) {
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.textContent = selectedText || url;
            range.deleteContents();
            range.insertNode(link);
            selection.removeAllRanges();
        }
    }
}

function toggleLink() {
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
}

function toggleImage() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const url = prompt('Insira o link da imagem');
        if (url) {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Imagem inserida';
            range.deleteContents();
            range.insertNode(img);
            selection.removeAllRanges();
        }
    }
}

function toggleHeading() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let container = range.commonAncestorContainer;
        
        // Encontra o elemento pai mais próximo
        while (container.nodeType !== Node.ELEMENT_NODE) {
            container = container.parentNode;
        }
        
        if (container.tagName === 'H3') {
            // Se já é um H3, converte para um parágrafo
            const p = document.createElement('p');
            p.innerHTML = container.innerHTML;
            container.parentNode.replaceChild(p, container);
        } else {
            // Se não é um H3, converte para H3
            const h3 = document.createElement('h3');
            h3.innerHTML = container.innerHTML;
            container.parentNode.replaceChild(h3, container);
        }
    }
}

function toggleUnorderedList() {
    document.execCommand('insertUnorderedList');
}

function toggleRemoveFormat() {
    document.execCommand('removeFormat', false, null);
}

document.addEventListener("keydown", (event) => {
    // Verifica se o elemento ativo é o noteBody
    if (event.ctrlKey && document.activeElement === noteBody) {
        switch (event.key) {
            case 'l':
                event.preventDefault();
                toggleUnorderedList();
                break;
            case 'h':
                event.preventDefault();
                toggleHeading();
                break;
            case 'k':
                event.preventDefault();
                toggleLink();
                break;
            case 'm':
                event.preventDefault();
                toggleImage();
                break;
            case 'e':
                event.preventDefault();
                toggleRemoveFormat();
                break;
        }
    }
});

function toggleSidebar(){
    document.getElementById("sidebar").classList.toggle('active');
    document.getElementById("overlay").classList.toggle('active');
}

applyStoredTheme();
initializeLocalStorage();
renderNotesList();
loadTodos();
toggleApagarTodos();
loadingMessage.style.display = "none";
