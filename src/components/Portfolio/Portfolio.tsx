import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromPortfolio } from '../../slices/portfolioSlice';
import './Portfolio.css';

const Portfolio: React.FC = () => {
  const portfolio = useSelector((state: any) => state.portfolio);
  const dispatch = useDispatch();

  return (
    <div className="portfolio">
      <h2>Your Portfolio</h2>
      {portfolio.length === 0 ? (
        <p>No cryptocurrencies added to portfolio</p>
      ) : (
        portfolio.map((crypto: any) => (
          <div key={crypto.id} className="portfolio-item">
            <h3>{crypto.name} ({crypto.symbol})</h3>
            <button onClick={() => dispatch(removeFromPortfolio(crypto.id))}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Portfolio;