import Weather from "../Components/Weather";
import SavedSites from "../Components/SavedSites";
import TodoList from "../Components/TodoList";

function Home() {
  return (
    <div className="NavPage">
      <button>Messages</button>
      <button>Tasks</button>

      <Weather />
      <SavedSites />
      <TodoList />

      <button>Settings</button>
    </div>
  );
}

export default Home;