import Weather from "../Components/Weather";
//import SavedSites from "../Components/SavedSites";
//import TodoList from "../Components/TodoList";
//MUST ADD INTO OWN PAGES LATER
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="h-auto w-full flex flex-col items-center gap-14 margin-auto">

    {/*Messages*/}
    <div className="flex items-center justify-center w-full h-25">
        <Link to="/messages" className="btn btn-primary text-2xl font-bold w-3/4 h-full">
            Messages
        </Link>
    </div>

    {/*Tasks*/}
    <div className="flex items-center justify-center w-full h-25">
        <Link to="/tasks" className="btn btn-secondary text-2xl font-bold w-3/4 h-full">
            Tasks
        </Link>
    </div>

    {/*Weather*/}
    <div className="flex items-center justify-center w-3/4 h-25 bg-base-300">
        <Weather />
    </div>

    {/*Settings*/}
    <div className="flex items-center justify-center w-full h-25">
        <Link to="/settings" className="btn btn-outline text-2xl font-bold w-3/4 h-full">
            Settings
        </Link>
    </div>

    </div>
  );
}

export default Home;