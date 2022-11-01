import "./App.css";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="container">
      <Link to={"/budget-manager"}>Budget Manager</Link>
      <Link to={"/hike-1000"}>Hike 1000</Link>
    </div>
  );
}

export default App;
