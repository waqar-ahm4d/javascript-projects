let state = {
  tasks: loadFromLocalStorage(),
};

function createTask(id, text, isCompleted = false) {
  return { id, text, isCompleted };
}

function toggleTaskStatus(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, isCompleted: !task.isCompleted } : task,
  );
}

function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

const elements = {
  form: document.getElementById("todo-form"),
  input: document.getElementById("todo-input"),
  listContainer: document.getElementById("todo-list"),
};

function saveToLocalStorage(tasks) {
  localStorage.setItem("todos", JSON.stringify(tasks));
}

function loadFromLocalStorage() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}

function escapeHTML(str) {
    const safeStr = str == null ? '' : String(str);
  return safeStr.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function render(tasks, container) {
  container.innerHTML = "";

  if (tasks.length === 0) {
    container.innerHTML = `<li class="todo-item" style="justify-content: center; color: var(--text-muted);">No tasks yet! Add one above.</li>`;
    return;
  }
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `todo-item ${task.isCompleted ? 'completed' : ''}`;
    li.dataset.id = task.id;

    li.innerHTML = `
      <div class="todo-item-left">
        <input type="checkbox" ${task.isCompleted ? 'checked' : ''}>
        <span class="task-text">${escapeHTML(task.text)}</span>
      </div>
      <button class="delete-btn" aria-label="Delete task">&times;</button>
    `;
    container.appendChild(li);
  });
}

function handleAddTask(text) {
    if(!text.trim()) return;

    const id = Date.now().toString();
    const newTask = createTask(id, text);

    state.tasks = [...state.tasks, newTask];

    saveToLocalStorage(state.tasks);
    render(state.tasks, elements.listContainer);

    elements.input.value = '';
    elements.input.focus();
}

function handleToggleTask(id) {
    state.tasks = toggleTaskStatus(state.tasks, id);
    saveToLocalStorage(state.tasks);
    render(state.tasks, elements.listContainer);
}

function handleDeleteTask(id) {
    state.tasks = removeTask(state.tasks, id);
    saveToLocalStorage(state.tasks);
    render(state.tasks, elements.listContainer);
}

function initApp() {
    elements.form.addEventListener('submit', e => {
        e.preventDefault();
        handleAddTask(elements.input.value);
    });

    elements.listContainer.addEventListener('click', e => {
        const target = e.target;
        const todoItem = target.closest('.todo-item');

        if(!todoItem) return;

        const id = todoItem.dataset.id;

        if(target.classList.contains('delete-btn')) {
            handleDeleteTask(id);
        } else if(target.type === 'checkbox' || target.closest('.todo-item-left')) {
            handleToggleTask(id);
        } 
    });
    render(state.tasks, elements.listContainer);
}
initApp();