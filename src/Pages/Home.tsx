import Weather from "../Components/Weather";
import SavedSites from "../Components/SavedSites";
import TodoList from "../Components/TodoList";

function Home() {
  return (
    <div
      className="NavPage"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <h1 style={{ marginBottom: "10px" }}> Weather </h1>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#2563eb",
            color: "white",
            cursor: "pointer",
          }}
        >
          Messages
        </button>

        <button
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#10b981",
            color: "white",
            cursor: "pointer",
          }}
        >
          Tasks
        </button>

        <button
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#8b5cf6",
            color: "white",
            cursor: "pointer",
          }}
        >
          Settings
        </button>
      </div>

      <Weather />
      <SavedSites />
      <TodoList />
    </div>
  );
}

export default Home;