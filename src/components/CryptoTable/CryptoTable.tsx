import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptos } from '../../slices/cryptoSlice'; 
import './CryptoTable.css';

const CryptoTable: React.FC = () => {
  const dispatch = useDispatch();
  const cryptos = useSelector((state: any) => state.cryptos.list);

  const [searchTerm, setSearchTerm] = useState('');
  const [showNullValues, setShowNullValues] = useState(false);

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchCryptos());
  }, [dispatch]);

  // Dynamic image selection based on crypto symbol
  const getImageForCrypto = (symbol: string) => {
    return `https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png`;
  };

  const filteredCryptos = cryptos.filter((crypto: any) => {
    const matchesSearch = crypto.name.toLowerCase().includes(searchTerm.toLowerCase());
    const showNulls = showNullValues || (!showNullValues && crypto.priceUsd !== null);
    return matchesSearch && showNulls;
  });

  // Calculate and display the prices of top cryptocurrencies (Bitcoin, Ethereum, Tether)
  const bitcoin = cryptos.find((crypto: any) => crypto.symbol === 'BTC');
  const ethereum = cryptos.find((crypto: any) => crypto.symbol === 'ETH');
  const tether = cryptos.find((crypto: any) => crypto.symbol === 'USDT');

  return (
    <div>
      {/* Header */}
      <div className="crypto-header">
        <h2>Crypto Currency</h2>
        <div className="crypto-header-info">
          <span><strong>Bitcoin:</strong> {bitcoin ? `${parseFloat(bitcoin.priceUsd).toFixed(2)} USD` : 'Loading...'}</span>
          <span><strong>Ethereum:</strong> {ethereum ? `${parseFloat(ethereum.priceUsd).toFixed(2)} USD` : 'Loading...'}</span>
          <span><strong>Tether:</strong> {tether ? `${parseFloat(tether.priceUsd).toFixed(2)} USD` : 'Loading...'}</span>
        </div>
        <div className="portfolio-info">
          <p><strong>Portfolio cost:</strong> <span>0.00 $</span></p>
          <p><strong>Portfolio change:</strong> <span>+0.00 (0.00%)</span></p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={showNullValues}
            onChange={(e) => setShowNullValues(e.target.checked)}
          />
          Show null values
        </label>
      </div>

      {/* Crypto Table */}
      <table className="crypto-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Image</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>Market Cap</th>
            <th>Change (24h)</th>
            <th>Add</th>
          </tr>
        </thead>
        <tbody>
          {filteredCryptos.slice(0, 100).map((crypto: any, index: number) => (
            <tr key={crypto.id}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={getImageForCrypto(crypto.symbol)}
                  alt={crypto.name}
                  className="crypto-image"
                  width="50px"
                />
              </td>
              <td>{crypto.name}</td>
              <td>{crypto.symbol}</td>
              <td>${parseFloat(crypto.priceUsd).toFixed(2)}</td>
              <td>${(parseFloat(crypto.marketCapUsd) / 1e9).toFixed(2)}B</td>
              <td
                className={
                  parseFloat(crypto.changePercent24Hr) >= 0
                    ? 'positive-change'
                    : 'negative-change'
                }
              >
                {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
              </td>
              <td>
                <button>Add to Portfolio</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;
