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
    dispatch(fetchCryptos());
  }, [dispatch]);

  const getImageForCrypto = (symbol: string) => {
    switch (symbol) {
      case 'BTC':
        return 'crypto-dashboard/src/assets/ico/btc@2x.png';
      case 'ETH':
        return '/images/cryptos/ethereum.png';
      case 'USDT':
        return '/images/cryptos/tether.png';
      default:
        return '/images/cryptos/default.png';
    }
  };

  const filteredCryptos = cryptos.filter((crypto: any) => {
    const matchesSearch = crypto.name.toLowerCase().includes(searchTerm.toLowerCase());
    const showNulls = showNullValues || (!showNullValues && crypto.priceUsd !== null);
    return matchesSearch && showNulls;
  });

  return (
    <div>
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
          {filteredCryptos.map((crypto: any, index: number) => (
            <tr key={crypto.id}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={getImageForCrypto(crypto.symbol)}
                  alt={crypto.name}
                  className="crypto-image"
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
