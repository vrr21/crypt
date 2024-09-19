import React from 'react';
import './CryptoCurrency.css';

const CryptoCurrency: React.FC = () => {
  return (
    <div className="crypto-currency">
      <h2>Crypto Currency</h2>
      <div className="crypto-info">
        <div className="crypto-item">
          <strong>Bitcoin:</strong> <span>57969.87 USD</span>
        </div>
        <div className="crypto-item">
          <strong>Ethereum:</strong> <span>2288.21 USD</span>
        </div>
        <div className="crypto-item">
          <strong>Tether:</strong> <span>1.00 USD</span>
        </div>
      </div>
      <div className="portfolio-info">
        <p><strong>Portfolio cost:</strong> <span>0.00 $</span></p>
        <p><strong>Portfolio change:</strong> <span>+0.00 (0.00%)</span></p>
      </div>
    </div>
  );
};

export default CryptoCurrency;