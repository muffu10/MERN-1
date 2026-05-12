import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const API = "/api/tasks";

  // Fetch Tasks
  const fetchTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add Task
  const addTask = async () => {
    if (!title) return;

    await axios.post(API, { title });

    setTitle("");
    fetchTasks();
  };

  // Toggle Complete
  const toggleTask = async (task) => {
    await axios.put(`${API}/${task._id}`, {
      completed: !task.completed,
    });

    fetchTasks();
  };

  // Delete Task
  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);

    fetchTasks();
  };

  // Start Edit
  const startEdit = (task) => {
    setEditId(task._id);
    setEditText(task.title);
  };

  // Save Edit
  const saveEdit = async (id) => {
    await axios.put(`${API}/${id}`, {
      title: editText,
    });

    setEditId(null);
    setEditText("");

    fetchTasks();
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter Task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button onClick={addTask}>Add</button>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <div className="task" key={task._id}>
            {editId === task._id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />

                <button onClick={() => saveEdit(task._id)}>
                  Save
                </button>
              </>
            ) : (
              <>
                <span
                  onClick={() => toggleTask(task)}
                  style={{
                    textDecoration: task.completed
                      ? "line-through"
                      : "none",
                    cursor: "pointer",
                  }}
                >
                  {task.title}
                </span>

                <div style={{ display: "flex", gap: "5px" }}>
                  <button onClick={() => startEdit(task)}>
                    Edit
                  </button>

                  <button onClick={() => deleteTask(task._id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;