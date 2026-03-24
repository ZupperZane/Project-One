<<<<<<< HEAD
function Home() {
  return (
    <section>
      <h2>Home</h2>
      <p>Do your work magic frontend boy.</p>
    </section>
  );
}

export default Home;
=======

import Weather from "../Components/Weather";

function Home() {
  return (
    <div className="NavPage">
      <button>Messages</button>
      <button>Tasks</button>
      <Weather />
      <button>Settings</button>
    </div>
  );
}

export default Home;    
>>>>>>> origin/weather
