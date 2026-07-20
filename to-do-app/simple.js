const loadFromLocalStorage = () => {
  let rawData = localStorage.getItem('todos');
  
  // If nothing is saved yet, return an empty array directly
  if (!rawData) {
    return [];
  }
  
  // Try parsing the saved data safely
  try {
    return JSON.parse(rawData);
  } catch (error) {
    // If old/corrupted data exists in localStorage, wipe it and return an empty array
    console.warn("Corrupted storage data found. Resetting 'todos'.");
    localStorage.removeItem('todos');
    return [];
  }
};
const saveToLocalStorage = (tasks) => {
    let stringfiedData = JSON.stringify(tasks);
    localStorage.setItem('todos', stringfiedData);
};

let tasksArray = loadFromLocalStorage();

let todoForm = document.getElementById("todo-form");
let todoInput = document.getElementById("todo-input");
let todoList = document.getElementById("todo-list");


todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let textValue = todoInput.value;

  if (textValue === "") return;

  let newTask = {
    id: Date.now().toString(),
    text: textValue,
    isCompleted: false,
  };

  tasksArray.push(newTask);
  saveToLocalStorage(tasksArray);
  renderTasks();
  todoInput.value = "";
  todoInput.focus();
});

let renderTasks = () => {
  todoList.innerHTML = "";

  if (tasksArray.length === 0) {
    todoList.innerHTML = `<li class="todo-item" style="justify-content: center; color: var(--text-muted);">No tasks yet! Add one above.</li>`;
    return;
  }
  for (let i = 0; i < tasksArray.length; i++) {
    let currentTask = tasksArray[i];
    let listItem = document.createElement("li");

    if (currentTask.isCompleted === true) {
      listItem.className = "todo-item completed";
    } else {
      listItem.className = "todo-item";
    }

    listItem.innerHTML = `
            <div class="todo-item-left" onclick="toggleTask('${currentTask.id}')">
        <input type="checkbox" ${currentTask.isCompleted ? "checked" : ""}>
        <span class="task-text">${currentTask.text}</span>
      </div>
      <button class="delete-btn" onclick="deleteTask('${currentTask.id}')">&times;</button>
        `;

    todoList.appendChild(listItem);
  }
  
}
renderTasks();

let toggleTask = id => {
    for(let i = 0; i < tasksArray.length; i++) {
        if(tasksArray[i].id === id) {
            tasksArray[i].isCompleted = !tasksArray[i].isCompleted;
            break;
        }
    }
    saveToLocalStorage(tasksArray);
    renderTasks();
}

let deleteTask = id => {
    for(let i = 0; i < tasksArray.length; i++) {
        if(tasksArray[i].id === id) {
            tasksArray.splice(i, 1);
            break;
        }
    }
    saveToLocalStorage(tasksArray);
    renderTasks();
}
