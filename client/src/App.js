import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Profile from './components/Profile';
import Maps from './components/Maps';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={
            <>
              <Navigation />
              <main className="main-content">
                <Home />
              </main>
            </>
          } />
          <Route path="/profile" element={
            <>
              <Navigation />
              <main className="main-content">
                <Profile />
              </main>
            </>
          } />
          <Route path="/maps" element={
            <>
              <Navigation />
              <main className="main-content">
                <Maps />
              </main>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
