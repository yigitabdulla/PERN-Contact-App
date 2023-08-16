import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import './App.css';
import { Home } from "./components/Home";
import { Auth } from "./components/Auth";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/auth" element={<Auth />}/>
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
