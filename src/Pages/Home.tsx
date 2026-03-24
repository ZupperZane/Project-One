import { Weather } from "../Components/Weather";

function Home(){
    return (
        <div className="NavPage">
            <button>
            Messages
            </button>
            <button>
            Tasks
            </button>
            <Weather/>
            <button>
            Settings
            </button>
        </div>
    )
}

export default Home;