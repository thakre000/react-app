import React, { useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // Add a new task
  const addTask = () => {
    if (input.trim() === "") return; // prevent empty tasks
    const newTask = { id: Date.now(), text: input, completed: false };
    setTasks([...tasks, newTask]);
    setInput("");
  };

  // Toggle task completion
  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="todo-container">
      <h1>To-Do List</h1>

      <div className="input-row">
        <input
          type="text"
          placeholder="Enter a task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul className="task-list">
        {tasks.length === 0 ? (
          <p>No tasks yet!</p>
        ) : (
          tasks.map(task => (
            <li key={task.id} className={task.completed ? "completed" : ""}>
              <span onClick={() => toggleTask(task.id)}>{task.text}</span>
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>❌</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
