import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const API = "/api/tasks";

  const fetchTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title) return;

    await axios.post(API, { title });
    setTitle("");
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await axios.put(`${API}/${task._id}`, {
      completed: !task.completed,
    });

    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
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
            <span
              onClick={() => toggleTask(task)}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer"
              }}
            >
              {task.title}
            </span>

            <button onClick={() => deleteTask(task._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;