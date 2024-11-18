import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import './CryptoCurrency.css';
import { addOrUpdateItem } from '../../slices/portfolioSlice';

const CryptoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const cryptos = useSelector((state: any) => state.cryptos.list);
  const dispatch = useDispatch();

  const crypto = cryptos.find((crypto: any) => crypto.id === id);

  const [timeframe, setTimeframe] = useState('1d');

  if (!crypto) {
    return <div>Криптовалюта не найдена.</div>;
  }

  const handleAddToPortfolio = () => {
    dispatch(addOrUpdateItem({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      price: parseFloat(crypto.priceUsd),
      amount: 1, // Добавляем одну единицу
    }));
    alert(`${crypto.name} добавлен в ваш портфель!`);
  };

  return (
    <div className="crypto-detail">
      <h2>{crypto.name} ({crypto.symbol})</h2>
      <div className="crypto-info">
        <p><strong>Price:</strong> ${parseFloat(crypto.priceUsd).toFixed(2)}</p>
        <p><strong>Market Cap:</strong> ${(parseFloat(crypto.marketCapUsd) / 1e9).toFixed(2)}B</p>
        <p><strong>Change (24h):</strong> {parseFloat(crypto.changePercent24Hr).toFixed(2)}%</p>
      </div>
      <button onClick={handleAddToPortfolio}>Add to Portfolio</button>
    </div>
  );
};

export default CryptoDetail;
