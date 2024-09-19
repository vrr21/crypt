import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CryptoTable from './components/CryptoTable/CryptoTable';
import './styles/App.css';

const App: React.FC = () => {

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<CryptoTable />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
