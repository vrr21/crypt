import React, { useState } from 'react'; 
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import './CryptoCurrency.css';
import { addToPortfolio } from '../../slices/portfolioSlice'; // Import portfolio action

const CryptoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const cryptos = useSelector((state: any) => state.cryptos.list);
  const dispatch = useDispatch();

  const crypto = cryptos.find((crypto: any) => crypto.id === id);

  const [timeframe, setTimeframe] = useState('1d');

  if (!crypto) {
    return <div>Криптовалюта не найдена.</div>;
  }

  const hourlyData = [
    { time: '2024-09-23 00:00', price: 61000 },
    { time: '2024-09-23 01:00', price: 61500 },
    { time: '2024-09-23 02:00', price: 62000 },
    { time: '2024-09-23 03:00', price: 61800 },
    { time: '2024-09-23 04:00', price: 62200 },
  ];

  const weeklyData = [
    { time: '2024-09-18 12:00', price: 61000 },
    { time: '2024-09-19 12:00', price: 61500 },
    { time: '2024-09-20 12:00', price: 62000 },
    { time: '2024-09-21 12:00', price: 61800 },
    { time: '2024-09-22 12:00', price: 62200 },
    { time: '2024-09-23 12:00', price: 62500 },
  ];

  const monthlyData = [
    { time: '2024-09-01', price: 60500 },
    { time: '2024-09-02', price: 61000 },
    { time: '2024-09-03', price: 61200 },
    { time: '2024-09-04', price: 61800 },
    { time: '2024-09-05', price: 62000 },
    { time: '2024-09-06', price: 62500 },
  ];

  let filteredPriceData;
  if (timeframe === '1d') {
    filteredPriceData = hourlyData;
  } else if (timeframe === '1w') {
    filteredPriceData = weeklyData;
  } else if (timeframe === '1m') {
    filteredPriceData = monthlyData;
  }

  // Function to handle adding the crypto to the portfolio
  const handleAddToPortfolio = () => {
    dispatch(addToPortfolio(crypto));
    alert(`${crypto.name} добавлен в ваш портфель!`);
  };

  // Function to get the image URL for the crypto
  const getImageForCrypto = (symbol: string) => {
    return `https://cryptoicons.org/api/icon/${symbol.toLowerCase()}/30`; // Using your original API
  };

  return (
    <div className="crypto-detail">
      <h2>{crypto.name} ({crypto.symbol})</h2>

      {/* Cryptocurrency Image */}
      <img
        src={getImageForCrypto(crypto.symbol)} // Use the function to get the crypto image
        alt={`${crypto.name} logo`}
        className="crypto-image"
      />

      <div className="crypto-info">
        <div className="crypto-item">
          <strong>Price:</strong> ${parseFloat(crypto.priceUsd).toFixed(2)}
        </div>
        <div className="crypto-item">
          <strong>Market capitalization:</strong> ${(parseFloat(crypto.marketCapUsd) / 1e9).toFixed(2)}B
        </div>
        <div className="crypto-item">
          <strong>Change (24 hours):</strong> 
          <span className={parseFloat(crypto.changePercent24Hr) >= 0 ? 'positive-change' : 'negative-change'}>
            {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Button to Add Crypto to Portfolio */}
      <div className="portfolio-buttons">
        <button onClick={handleAddToPortfolio}>Add to the portfolio</button>
        <button onClick={() => window.history.back()}>Go back to the table</button>
      </div>

      {/* Timeframe Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label>Time frame: </label>
        <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
          <option value="1d">1 day</option>
          <option value="1w">1 week</option>
          <option value="1m">1 mounth</option>
        </select>
      </div>

      {/* Price Change Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredPriceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Brush dataKey="time" height={30} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CryptoDetail;
