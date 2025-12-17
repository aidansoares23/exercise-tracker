import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddExercisePage from "./pages/AddExercisePage";
import { EditExercisePage } from "./pages/EditExercisePage";
import Navigation from "./components/Navigation";

function App() {
  const [exerciseToEdit, setExerciseToEdit] = useState();

  const currentYear = new Date().getFullYear();

  return (
    <Router>
      <div className="App">
        <header>
          <div className="test-header">
            <h2>Exercise Tracker</h2>
            <p>Full Stack MERN App Demonstration</p>
          </div>

          <Navigation />
        </header>

        <main className="App-content">
          <Routes>
            <Route path="/" element={<HomePage setExerciseToEdit={setExerciseToEdit} />} />
            <Route path="/add-exercise" element={<AddExercisePage />} />
            <Route path="/edit-exercise" element={<EditExercisePage exerciseToEdit={exerciseToEdit} />} />
          </Routes>
        </main>

        <footer className="App-footer">
          <p>© {currentYear} Aidan Soares</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
