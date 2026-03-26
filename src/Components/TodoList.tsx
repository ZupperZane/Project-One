import { useState } from "react";

export default function TodoList() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);

  function handleAddTask(e: any) {
    e.preventDefault();

    if (task.trim() === "") return;

    setTasks([...tasks, task]);
    setTask("");
  }

  function handleDelete(index: number) {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "550px",
        backgroundColor: "#ffffff",
        borderRadius: "18px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #10b981, #14b8a6)",
          color: "white",
          padding: "18px 20px",
        }}
      >
        <h2 style={{ margin: 0 }}>Todo List</h2>
        <p style={{ margin: "6px 0 0 0", fontSize: "14px" }}>
          Keep daily tasks organized
        </p>
      </div>

      <div
        style={{
          padding: "20px",
          backgroundColor: "white",
          minHeight: "180px",
          color: "black",
        }}
      >
        <form
          onSubmit={handleAddTask}
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "18px",
          }}
        >
          <input
            type="text"
            placeholder="Enter a task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              backgroundColor: "white",
              color: "black",
            }}
          />

          <button
            type="submit"
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #10b981, #14b8a6)",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </form>

        {tasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {tasks.map((t, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                  padding: "12px",
                  borderRadius: "10px",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                }}
              >
                <span>
                  {index + 1}. {t}
                </span>

                <button
                  onClick={() => handleDelete(index)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#ef4444",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}