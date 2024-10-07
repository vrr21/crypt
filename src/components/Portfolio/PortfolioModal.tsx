import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromPortfolio, updatePortfolioAmount } from '../../slices/portfolioSlice';
import './PortfolioModal.css';

const PortfolioModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useDispatch();
  const portfolio = useSelector((state: any) => state.portfolio.items);

  const handleRemove = (cryptoId: string) => {
    dispatch(removeFromPortfolio(cryptoId));
  };

  const handleUpdateAmount = (cryptoId: string, newAmount: number) => {
    dispatch(updatePortfolioAmount({ cryptoId, newAmount }));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={onClose}>close</button>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Logo</th>
              <th>Symbol</th>
              <th>Buy price (USD)</th>
              <th>Number</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((crypto: any, index: number) => (
              <tr key={crypto.id}>
                <td>{index + 1}</td>
                <td>{crypto.name}</td>
                <td><img src={crypto.logo} alt={crypto.name} /></td>
                <td>{crypto.symbol}</td>
                <td>{crypto.buyPrice}</td>
                <td>
                  <button onClick={() => handleUpdateAmount(crypto.id, crypto.amount - 1)}>-</button>
                  {crypto.amount}
                  <button onClick={() => handleUpdateAmount(crypto.id, crypto.amount + 1)}>+</button>
                </td>
                <td><button onClick={() => handleRemove(crypto.id)}>delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioModal;
