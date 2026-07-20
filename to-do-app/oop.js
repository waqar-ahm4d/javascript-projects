class Task {
    constructor(id, text, isCompleted = false) {
        this.id = id;
        this.text = text;
        this.isCompleted = isCompleted;

    }
    toggleStatus() {
        this.isCompleted = !this.isCompleted;
    }
}
class TodoApp {
    constructor() {
        this.tasks = this.loadFromLocalStorage();

        this.form = document.getElementById("todo-form");
        this.input = document.getElementById("todo-input");
        this.listContainer = document.getElementById("todo-list");

        this.initEventListeners();

        this.render();
    }
    initEventListeners() {
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.addTask(this.input.value);
        });
        this.listContainer.addEventListener("click", e => {
            const target = e.target;
            const todoItem = target.closest(".todo-item");
            if(!todoItem) return;

            const id = todoItem.dataset.id;

            if(target.classList.contains("delete-btn")) {
                this.deleteTask(id);
            } else if(target.type === "checkbox" || target.closest(".todo-item-left")) {
                this.toggleTask(id);
            }
        });
    }
    addTask(text) {
        if(!text.trim()) return;

        const id = Date.now().toString();
        const newTask = new Task(id, text);

        this.tasks.push(newTask);
        this.saveToLocalStorage();
        this.render();

        this.input.value = '';
        this.input.focus();
    }
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);

        this.saveToLocalStorage();
        this.render();
    }
    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if(task) {
            task.toggleStatus();
            this.saveToLocalStorage();
            this.render();
        }
    }
    saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(this.tasks));
    }
    loadFromLocalStorage() {
        const rawTasks = JSON.parse(localStorage.getItem('todos')) || [];
        return rawTasks.map(t => new Task(t.id, t.text, t.isCompleted));
    }
    render() {
        this.listContainer.innerHTML = "";
        if(this.tasks.length === 0) {
            this.listContainer.innerHTML = `<li class="todo-item" style="justify-content: center; color: var(--text-muted);">No tasks yet! Add one above.</li>`;
            return;
        }
        this.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `todo-item ${task.isCompleted ? 'checked' : ''}`;
            li.dataset.id = task.id;

            li.innerHTML = `<div class="todo-item-left">
            <input type="checkbox" ${task.isCompleted ? 'checked' : ''} />
            <span class="task-text">${this.escapeHTML(task.text)}</span>
            </div>
            <button class="delete-btn" aria-label="Delete Task">&times;</button>
            `;

            this.listContainer.appendChild(li);
        });
    }
    escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&' : '&amp;',
            '<' : '&lt;',
            '>' : '&gt;',
            "'" : '&#39;',
            '"' : '&quot;'
        }[tag] || tag));
    }

}

const app = new TodoApp();