import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/ui';
import { Dashboard, Results, Settings } from './pages';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Sidebar />
        <main className="ml-64 p-0 bg-white">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/results" element={<Results />} />
            {/* Placeholder routes for sidebar navigation */}
            <Route path="/projects" element={<div className="text-gray-900 text-center py-12"><h2 className="text-2xl font-semibold mb-4">Projects</h2><p className="text-gray-600">Coming Soon</p></div>} />
            <Route path="/brand-guidelines" element={<div className="text-gray-900 text-center py-12"><h2 className="text-2xl font-semibold mb-4">Brand Guidelines</h2><p className="text-gray-600">Coming Soon</p></div>} />
            <Route path="/design-strategy" element={<div className="text-gray-900 text-center py-12"><h2 className="text-2xl font-semibold mb-4">Design Strategy</h2><p className="text-gray-600">Coming Soon</p></div>} />
            <Route path="/campaign-planner" element={<div className="text-gray-900 text-center py-12"><h2 className="text-2xl font-semibold mb-4">Campaign Planner</h2><p className="text-gray-600">Coming Soon</p></div>} />
            <Route path="/jira-integration" element={<div className="text-gray-900 text-center py-12"><h2 className="text-2xl font-semibold mb-4">Jira Integration</h2><p className="text-gray-600">Coming Soon</p></div>} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/brief-analysis" element={<div className="text-gray-900 text-center py-12"><h2 className="text-2xl font-semibold mb-4">Brief Analysis Agent</h2><p className="text-gray-600">Coming Soon</p></div>} />
            <Route path="/strategy-analysis" element={<div className="text-gray-900 text-center py-12"><h2 className="text-2xl font-semibold mb-4">Strategy Analysis Agent</h2><p className="text-gray-600">Coming Soon</p></div>} />
            <Route path="/plan-creator" element={<div className="text-gray-900 text-center py-12"><h2 className="text-2xl font-semibold mb-4">Plan Creator Agent</h2><p className="text-gray-600">Coming Soon</p></div>} />
            <Route path="/task-creator" element={<div className="text-gray-900 text-center py-12"><h2 className="text-2xl font-semibold mb-4">Task Creator Agent</h2><p className="text-gray-600">Coming Soon</p></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
