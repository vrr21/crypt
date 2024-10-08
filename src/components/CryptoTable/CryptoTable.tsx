import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCryptos } from '../../slices/cryptoSlice'; 
import './CryptoTable.css';

const CryptoTable: React.FC = () => {
  const dispatch = useDispatch();
  const cryptos = useSelector((state: any) => state.cryptos.list);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');  // Состояние для строки поиска
  const [showNullValues, setShowNullValues] = useState(false); // Фильтр для показа нулевых значений
  const [selectedCrypto, setSelectedCrypto] = useState<any | null>(null); // Состояние для выбранной криптовалюты
  const [showModal, setShowModal] = useState(false); // Состояние для модального окна
  const [cryptoAmount, setCryptoAmount] = useState(1); // Состояние для количества криптовалют
  const [portfolio, setPortfolio] = useState<any[]>([]); // Состояние для хранения портфеля

  const [portfolioCost, setPortfolioCost] = useState(0); // Общая стоимость портфеля
  const [portfolioChange, setPortfolioChange] = useState(0); // Изменение портфеля

  // Загружаем список криптовалют при монтировании компонента
  useEffect(() => {
    // @ts-ignore
    dispatch(fetchCryptos());
  }, [dispatch]);

  // Функция для получения изображения криптовалюты по её символу
  const getImageForCrypto = (symbol: string) => {
    return `https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png`;
  };

  // Фильтруем список криптовалют в зависимости от строки поиска и фильтрации нулевых значений
  const filteredCryptos = cryptos.filter((crypto: any) => {
    const matchesSearch = crypto.name.toLowerCase().includes(searchTerm.toLowerCase());
    const showNulls = showNullValues || (!showNullValues && crypto.priceUsd !== null);
    return matchesSearch && showNulls;
  });

  // Получаем топовые криптовалюты для отображения на главной (Bitcoin, Ethereum, Tether)
  const bitcoin = cryptos.find((crypto: any) => crypto.symbol === 'BTC');
  const ethereum = cryptos.find((crypto: any) => crypto.symbol === 'ETH');
  const tether = cryptos.find((crypto: any) => crypto.symbol === 'USDT');

  // Обработчик клика на название криптовалюты для перехода на её страницу
  const handleCryptoClick = (cryptoId: string) => {
    navigate(`/crypto/${cryptoId}`);
  };

  // Обработчик для добавления криптовалюты в портфель
  const handleAddToPortfolio = (crypto: any) => {
    setSelectedCrypto(crypto);
    setShowModal(true);
  };

  // Обработчик изменения количества выбранной криптовалюты
  const handleAmountChange = (amount: number) => {
    if (amount >= 1) {
      setCryptoAmount(amount);
    }
  };

  // Функция для вычисления общей стоимости и изменения портфеля
  const updatePortfolioStats = (newPortfolio: any[]) => {
    let totalCost = 0;
    let totalChange = 0;

    newPortfolio.forEach((item) => {
      totalCost += item.amount * parseFloat(item.crypto.priceUsd);
      totalChange += item.amount * parseFloat(item.crypto.priceUsd) * (parseFloat(item.crypto.changePercent24Hr) / 100);
    });

    setPortfolioCost(totalCost);
    setPortfolioChange(totalChange);
  };

  // Подтверждение добавления криптовалюты в портфель
  const confirmAddToPortfolio = () => {
    const existingCrypto = portfolio.find(item => item.crypto.id === selectedCrypto.id);

    let updatedPortfolio;

    // Если криптовалюта уже есть в портфеле, обновляем её количество
    if (existingCrypto) {
      updatedPortfolio = portfolio.map(item =>
        item.crypto.id === selectedCrypto.id
          ? { ...item, amount: item.amount + cryptoAmount }
          : item
      );
    } else {
      // Иначе добавляем новую криптовалюту в портфель
      updatedPortfolio = [...portfolio, { crypto: selectedCrypto, amount: cryptoAmount }];
    }

    setPortfolio(updatedPortfolio);
    updatePortfolioStats(updatedPortfolio);

    setShowModal(false);
    setSelectedCrypto(null);
    setCryptoAmount(1); // Сбросить количество после добавления в портфель
  };

  // Обработчик удаления криптовалюты из портфеля
  const removeFromPortfolio = (cryptoId: string) => {
    const updatedPortfolio = portfolio.filter(item => item.crypto.id !== cryptoId);
    setPortfolio(updatedPortfolio);
    updatePortfolioStats(updatedPortfolio);
  };

  // Обработчик изменения количества криптовалюты прямо в модальном окне
  const updateCryptoAmount = (cryptoId: string, newAmount: number) => {
    if (newAmount >= 1) {
      const updatedPortfolio = portfolio.map(item =>
        item.crypto.id === cryptoId ? { ...item, amount: newAmount } : item
      );
      setPortfolio(updatedPortfolio);
      updatePortfolioStats(updatedPortfolio);
    }
  };

  return (
    <div>
      {/* Заголовок таблицы криптовалют */}
      <div className="crypto-header">
        <h2>Crypto Currency</h2>
        <div className="crypto-header-info">
          <span><strong>Bitcoin:</strong> {bitcoin ? `${parseFloat(bitcoin.priceUsd).toFixed(2)} USD` : 'Loading...'}</span>
          <span><strong>Ethereum:</strong> {ethereum ? `${parseFloat(ethereum.priceUsd).toFixed(2)} USD` : 'Loading...'}</span>
          <span><strong>Tether:</strong> {tether ? `${parseFloat(tether.priceUsd).toFixed(2)} USD` : 'Loading...'}</span>
        </div>
        <div className="portfolio-info">
          <p><strong>Portfolio cost:</strong> <span>{portfolioCost.toFixed(2)} $</span></p>
          <p><strong>Portfolio change:</strong> <span>{portfolioChange.toFixed(2)} $ ({(portfolioChange / portfolioCost * 100).toFixed(2)}%)</span></p>
        </div>
      </div>

      {/* Поисковая строка и фильтры */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Обновление строки поиска
        />
        <label>
          <input
            type="checkbox"
            checked={showNullValues}
            onChange={(e) => setShowNullValues(e.target.checked)} // Обновление фильтра
          />
          Show null values
        </label>
      </div>

      {/* Таблица криптовалют */}
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
          {/* Перебираем и отображаем криптовалюты */}
          {filteredCryptos.slice(0, 100).map((crypto: any, index: number) => (
            <tr key={crypto.id}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={getImageForCrypto(crypto.symbol)} // Получаем и отображаем изображение криптовалюты
                  alt={crypto.name}
                  className="crypto-image"
                  width="50px"
                />
              </td>
              <td
                onClick={() => handleCryptoClick(crypto.id)} // Переход на страницу криптовалюты
                style={{ cursor: 'pointer', color: '#1e90ff' }}
              >
                {crypto.name}
              </td>
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
                <button onClick={() => handleAddToPortfolio(crypto)}>Add to Portfolio</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Модальное окно для добавления и редактирования в портфеле */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>х</button>
            {portfolio.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((item, index) => (
                    <tr key={item.crypto.id}>
                      <td>{index + 1}</td>
                      <td>{item.crypto.name}</td>
                      <td>{item.crypto.symbol}</td>
                      <td>${parseFloat(item.crypto.priceUsd).toFixed(2)}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.amount}
                          onChange={(e) => updateCryptoAmount(item.crypto.id, parseInt(e.target.value))}
                        />
                      </td>
                      <td>
                        <button onClick={() => removeFromPortfolio(item.crypto.id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No cryptos in portfolio.</p>
            )}
            <button onClick={confirmAddToPortfolio}>Confirm</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoTable;
