import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddExercisePage from './pages/AddExercisePage';
import { EditExercisePage } from './pages/EditExercisePage';
import { useState } from 'react';
import Navigation from './components/Navigation';

function App() {
  const [exerciseToEdit, setExerciseToEdit] = useState();

  return (
    <div className="App">

      <header className="App-header">
        <Router>
        <div className="test-header">
          <h2>Exercise Tracker</h2>
          <p>Full Stack MERN App Demonstration</p>
          </div>
          <br />
          <Navigation />
          <br />
          <Routes>
            <Route path="/" element={<HomePage setExerciseToEdit={setExerciseToEdit}/>}/>
            <Route path="/add-exercise" element={<AddExercisePage /> }/>
            <Route path="/edit-exercise" element={ <EditExercisePage exerciseToEdit={exerciseToEdit}/>}/>
          </Routes>
        </Router>
      </header>

      <footer className="App-footer">
        <p>© 2023 Aidan Soares</p>
      </footer>
    </div>
  );
}

export default App;
