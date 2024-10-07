// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CryptoTable from './components/CryptoTable/CryptoTable';
import CryptoDetail from '././components/CryptoCurrency/CryptoDetail';  // Импортируем новый компонент

const App: React.FC = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<CryptoTable />} />
          <Route path="/crypto/:id" element={<CryptoDetail />} />  {/* Новый маршрут для детальной информации */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
