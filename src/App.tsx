import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/ui';
import { Dashboard, Results, Settings } from './pages';
import './App.css';
import {NewImage} from "@/pages/NewImage.tsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Sidebar />
        <main className="ml-64 p-0 bg-white">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/new-image" element={<NewImage />} />
            <Route path="/results" element={<Results />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
