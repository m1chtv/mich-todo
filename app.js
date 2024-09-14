window.onload = function() {
  loadTasks();
};

function addTask() {
  const taskInput = document.getElementById('task-input');
  const taskText = taskInput.value.trim();
  const priorityInput = document.querySelector('input[name="priority"]:checked').value;

  if (taskText === '') return;

  const task = { text: taskText, completed: false, priority: priorityInput };

  saveTaskToStorage(task);
  renderTasks();
  taskInput.value = '';
}

function renderTasks(filter = 'all') {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  const tasks = getTasksFromStorage();
  let completedCount = 0;
  let pendingCount = 0;

  tasks.forEach((task, index) => {
    if (filter === 'completed' && !task.completed) return;
    if (filter === 'pending' && task.completed) return;

    const li = document.createElement('li');
    li.classList.toggle('completed', task.completed);
    li.classList.add(task.priority);

    li.innerHTML = `
      <label>
        <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleComplete(${index})">
        <span>${task.text}</span>
      </label>
      <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
    `;

    taskList.appendChild(li);

    if (task.completed) {
      completedCount++;
    } else {
      pendingCount++;
    }
  });

  document.getElementById('completed-count').textContent = `Completed: ${completedCount}`;
  document.getElementById('pending-count').textContent = `Pending: ${pendingCount}`;
}

function toggleComplete(index) {
  const tasks = getTasksFromStorage();
  tasks[index].completed = !tasks[index].completed;
  saveTasksToStorage(tasks);
  renderTasks();
}

function deleteTask(index) {
  let tasks = getTasksFromStorage();
  tasks.splice(index, 1);
  saveTasksToStorage(tasks);
  renderTasks();
}

function filterTasks(filter) {
  renderTasks(filter);
}

function saveTaskToStorage(task) {
  const tasks = getTasksFromStorage();
  tasks.push(task);
  saveTasksToStorage(tasks);
}

function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromStorage() {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
}

function loadTasks() {
  renderTasks();
}

document.addEventListener('DOMContentLoaded', renderTasks);
