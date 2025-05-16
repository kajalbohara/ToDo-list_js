let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Show toast notification
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => (toast.style.display = 'none'), 3000);        
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks based on filter and status
function renderTasks() {
  const incompleteContainer = document.getElementById('incomplete');
  const completeContainer = document.getElementById('complete');
  incompleteContainer.innerHTML = '';
  completeContainer.innerHTML = '';

  tasks.forEach((task, index) => {
    if (currentFilter !== 'all' && task.completed !== (currentFilter === 'complete'))
      return;

    const div = document.createElement('div');
    div.className = 'task';
    div.draggable = true;
    div.ondragstart = (e) => e.dataTransfer.setData('index', index);

    // Buttons: Complete (if incomplete), Edit, Delete
    let buttonsHTML = '';
    if (!task.completed) {
      buttonsHTML += `<button style="background:#4CAF50; margin-right:5px;" onclick="completeTask(${index})">✔️</button>`;
    }
    buttonsHTML += `
      <button onclick="editTask(${index})" style="background:#03a9f4;">✏️</button>
      <button onclick="deleteTask(${index})">🗑️</button>
    `;

    div.innerHTML = `
      <strong>${task.title}</strong><br>
      <small>${task.description || ''} ${task.dueDate ? '(Due: ' + task.dueDate + ')' : ''}</small><br>
      ${buttonsHTML}
    `;

    if (task.completed) {
      completeContainer.appendChild(div);
    } else {
      incompleteContainer.appendChild(div);
    }
  });
}

// Add new task
function addTask() {
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('desc').value.trim();
  const dueDate = document.getElementById('due').value;
  if (!title) return alert('Title is required.');

  let isCompleted = false;

  if (dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    // Set time of both dates to midnight to compare just dates
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    if (due < today) {
      isCompleted = true; // Past due date → mark as complete
    }
  }

  tasks.push({ title, description, dueDate, completed: isCompleted });
  saveTasks();
  renderTasks();
  showToast('✅ Task Created');

  // Clear inputs
  document.getElementById('title').value = '';
  document.getElementById('desc').value = '';
  document.getElementById('due').value = '';
}


// Edit task
function editTask(index) {
  const task = tasks[index];
  const newTitle = prompt('Edit title', task.title);
  const newDesc = prompt('Edit description', task.description);
  if (newTitle !== null) {
    task.title = newTitle.trim();
    task.description = newDesc.trim();
    saveTasks();
    renderTasks();
    showToast('✏️ Task Updated');
  }
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
  showToast('🗑️ Task Deleted');
}

// Mark task as complete
function completeTask(index) {
  tasks[index].completed = true;
  saveTasks();
  renderTasks();
  showToast('✔️ Task Completed');
}

// Drag and drop handlers
function drop(event, completed) {
  event.preventDefault();
  const index = event.dataTransfer.getData('index');
  tasks[index].completed = completed;
  saveTasks();
  renderTasks();
  showToast(completed ? '🔄 Moved to Completed' : '🔄 Moved to Incomplete');
}

function allowDrop(event) {
  event.preventDefault();
}

// Filter tasks by status
function filterTasks(filter) {
  currentFilter = filter;
  renderTasks();
}

// Theme toggle logic
const toggle = document.getElementById('themeToggle');

window.onload = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  renderTasks();
};

toggle.onclick = () => {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

