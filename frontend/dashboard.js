let allTasks = [];
let currentFilter = "all";
let editingTaskId = null;

window.addEventListener("DOMContentLoaded", () => {
  requireAuth();

  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    document.getElementById("user-greeting").textContent = `Hello, ${user.name}!`;
  }

  loadTasks();

  document.getElementById("logout-btn").addEventListener("click", logout);
  document.getElementById("add-task-btn").addEventListener("click", handleAddTask);
  document.getElementById("cancel-edit-btn").addEventListener("click", closeModal);
  document.getElementById("save-edit-btn").addEventListener("click", handleSaveEdit);

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });
});

async function loadTasks() {
  try {
    allTasks = await apiRequest("/api/tasks");
    renderTasks();
  } catch (err) {
    document.getElementById("tasks-container").innerHTML =
      `<div class="alert alert-error">Failed to load tasks: ${err.message}</div>`;
  }
}

function renderTasks() {
  const container = document.getElementById("tasks-container");

  let filtered = allTasks;
  if (currentFilter === "pending") filtered = allTasks.filter((t) => !t.completed);
  if (currentFilter === "completed") filtered = allTasks.filter((t) => t.completed);
  if (currentFilter === "high") filtered = allTasks.filter((t) => t.priority === "high");

  document.getElementById("total-count").textContent = allTasks.length;
  document.getElementById("pending-count").textContent = allTasks.filter((t) => !t.completed).length;
  document.getElementById("done-count").textContent = allTasks.filter((t) => t.completed).length;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state">
      <span>📭</span>
      <p>No tasks here yet. Add one above!</p>
    </div>`;
    return;
  }

  container.innerHTML = filtered
    .map((task) => {
      const priorityLabel = { low: "🟢 Low", medium: "🟡 Medium", high: "🔴 High" }[task.priority];
      const date = new Date(task.createdAt).toLocaleDateString();

      return `
        <div class="task-card ${task.completed ? "task-completed" : ""} priority-${task.priority}">
          <div class="task-left">
            <input
              type="checkbox"
              class="task-checkbox"
              ${task.completed ? "checked" : ""}
              onchange="toggleComplete('${task._id}', this.checked)"
            />
            <div class="task-info">
              <div class="task-title ${task.completed ? "strikethrough" : ""}">${task.title}</div>
              ${task.description ? `<div class="task-desc">${task.description}</div>` : ""}
              <div class="task-meta">
                <span class="priority-badge priority-${task.priority}">${priorityLabel}</span>
                <span class="task-date">${date}</span>
              </div>
            </div>
          </div>
          <div class="task-actions">
            <button class="btn btn-sm btn-edit" onclick="openEditModal('${task._id}')">✏️ Edit</button>
            <button class="btn btn-sm btn-delete" onclick="handleDelete('${task._id}')">🗑️ Delete</button>
          </div>
        </div>
      `;
    })
    .join("");
}

async function handleAddTask() {
  const title = document.getElementById("task-title").value.trim();
  const description = document.getElementById("task-desc").value.trim();
  const priority = document.getElementById("task-priority").value;
  const errorBox = document.getElementById("form-error");

  errorBox.classList.add("hidden");

  if (!title) {
    showError(errorBox, "Task title cannot be empty.");
    return;
  }

  const btn = document.getElementById("add-task-btn");
  btn.textContent = "Adding...";
  btn.disabled = true;

  try {
    const newTask = await apiRequest("/api/tasks", "POST", { title, description, priority });

    allTasks.unshift(newTask);
    renderTasks();

    document.getElementById("task-title").value = "";
    document.getElementById("task-desc").value = "";
    document.getElementById("task-priority").value = "medium";
  } catch (err) {
    showError(errorBox, err.message);
  }

  btn.textContent = "Add Task";
  btn.disabled = false;
}

async function toggleComplete(taskId, completed) {
  try {
    const updated = await apiRequest(`/api/tasks/${taskId}`, "PUT", { completed });
    allTasks = allTasks.map((t) => (t._id === taskId ? updated : t));
    renderTasks();
  } catch (err) {
    alert("Failed to update task: " + err.message);
  }
}

async function handleDelete(taskId) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  try {
    await apiRequest(`/api/tasks/${taskId}`, "DELETE");
    allTasks = allTasks.filter((t) => t._id !== taskId);
    renderTasks();
  } catch (err) {
    alert("Failed to delete task: " + err.message);
  }
}

function openEditModal(taskId) {
  const task = allTasks.find((t) => t._id === taskId);
  if (!task) return;

  editingTaskId = taskId;

  document.getElementById("edit-title").value = task.title;
  document.getElementById("edit-desc").value = task.description || "";
  document.getElementById("edit-priority").value = task.priority;

  document.getElementById("edit-modal").classList.remove("hidden");
}

function closeModal() {
  editingTaskId = null;
  document.getElementById("edit-modal").classList.add("hidden");
}

async function handleSaveEdit() {
  if (!editingTaskId) return;

  const title = document.getElementById("edit-title").value.trim();
  const description = document.getElementById("edit-desc").value.trim();
  const priority = document.getElementById("edit-priority").value;

  if (!title) {
    alert("Title cannot be empty.");
    return;
  }

  try {
    const updated = await apiRequest(`/api/tasks/${editingTaskId}`, "PUT", {
      title,
      description,
      priority,
    });

    allTasks = allTasks.map((t) => (t._id === editingTaskId ? updated : t));
    renderTasks();
    closeModal();
  } catch (err) {
    alert("Failed to save changes: " + err.message);
  }
}

document.getElementById("edit-modal").addEventListener("click", (e) => {
  if (e.target === document.getElementById("edit-modal")) {
    closeModal();
  }
});
