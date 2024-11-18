import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCryptos } from '../../slices/cryptoSlice';
import { addOrUpdateItem } from '../../slices/portfolioSlice';
import './CryptoTable.css';
import PortfolioModal from '../Portfolio/PortfolioModal';
import Pagination from '../Pagination/Pagination';
//handleCryptoClick
const CryptoTable: React.FC = () => {
  const dispatch = useDispatch();
  const cryptos = useSelector((state: any) => state.cryptos.list);
  const portfolio = useSelector((state: any) => state.portfolio.items);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(''); // Состояние для строки поиска
  const [showNullValues, setShowNullValues] = useState(false); // Фильтр для показа нулевых значений
  const [selectedCrypto, setSelectedCrypto] = useState<any | null>(null); // Состояние для выбранной криптовалюты
  const [showModal, setShowModal] = useState(false); // Состояние для модального окна добавления в портфель
  const [cryptoAmount, setCryptoAmount] = useState(1); // Состояние для количества криптовалют
  const [portfolioCost, setPortfolioCost] = useState(0); // Общая стоимость портфеля
  const [portfolioChange, setPortfolioChange] = useState(0); // Изменение портфеля
  const [showPortfolioModal, setShowPortfolioModal] = useState(false); // Состояние для модального окна с портфелем
  const [currentPage, setCurrentPage] = useState(1); // Состояние текущей страницы
  const itemsPerPage = 100; // Количество криптовалют на одной странице

  // Загружаем список криптовалют при монтировании компонента
  useEffect(() => {
    //@ts-ignore
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
  const updatePortfolioStats = () => {
    let totalCost = 0;
    let totalChange = 0;

    portfolio.forEach((item: any) => {
      const cost = item.amount * item.price;
      const change = cost * (item.changePercent24Hr / 100);
      totalCost += cost;
      totalChange += change;
    });

    setPortfolioCost(totalCost);
    setPortfolioChange(totalChange);
  };

  useEffect(() => {
    updatePortfolioStats();
  }, [portfolio]);

  // Подтверждение добавления криптовалюты в портфель
  const confirmAddToPortfolio = () => {
    dispatch(
      addOrUpdateItem({
        id: selectedCrypto.id,
        name: selectedCrypto.name,
        symbol: selectedCrypto.symbol,
        price: parseFloat(selectedCrypto.priceUsd),
        amount: cryptoAmount,
      })
    );

    setShowModal(false);
    setSelectedCrypto(null);
    setCryptoAmount(1);
  };

  // Обработчик открытия модального окна портфеля
  const handleOpenPortfolioModal = () => {
    setShowPortfolioModal(true);
  };

  // Обработчик закрытия модального окна портфеля
  const handleClosePortfolioModal = () => {
    setShowPortfolioModal(false);
  };

  // Пагинация - вычисляем количество страниц
  const totalPages = Math.ceil(filteredCryptos.length / itemsPerPage);

  // Получаем криптовалюты для текущей страницы
  const currentCryptos = filteredCryptos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {/* Заголовок таблицы криптовалют */}
      <div className="crypto-header">
        <h2>Crypto Currency</h2>
        <div className="crypto-header-info">
          <span>
            <strong>Bitcoin:</strong> {bitcoin ? `${parseFloat(bitcoin.priceUsd).toFixed(2)} USD` : 'Loading...'}
          </span>
          <span>
            <strong>Ethereum:</strong> {ethereum ? `${parseFloat(ethereum.priceUsd).toFixed(2)} USD` : 'Loading...'}
          </span>
          <span>
            <strong>Tether:</strong> {tether ? `${parseFloat(tether.priceUsd).toFixed(2)} USD` : 'Loading...'}
          </span>
        </div>
        {/* Обработчик клика на блок с портфелем для открытия модального окна */}
        <div className="portfolio-info" onClick={handleOpenPortfolioModal} style={{ cursor: 'pointer' }}>
          <p>
            <strong>Portfolio cost:</strong> <span>{portfolioCost.toFixed(2)} $</span>
          </p>
          <p>
            <strong>Portfolio change:</strong> <span>{portfolioChange.toFixed(2)} $</span>
          </p>
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
          {currentCryptos.map((crypto: any, index: number) => (
            <tr key={crypto.id}>
              <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
              <td>
                <img src={getImageForCrypto(crypto.symbol)} alt={crypto.name} className="crypto-image" />
              </td>
              <td onClick={() => handleCryptoClick(crypto.id)} style={{ cursor: 'pointer', color: '#fff'  }}>
                {crypto.name}
              </td>
              <td>{crypto.symbol}</td>
              <td>${parseFloat(crypto.priceUsd).toFixed(2)}</td>
              <td>${(parseFloat(crypto.marketCapUsd) / 1e9).toFixed(2)}B</td>
              <td className={parseFloat(crypto.changePercent24Hr) >= 0 ? 'positive-change' : 'negative-change'}>
                {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
              </td>
              <td>
                <button onClick={() => handleAddToPortfolio(crypto)}>Add</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      {/* Модальное окно для добавления и редактирования в портфеле */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h3>{selectedCrypto?.name}</h3>
            <p>Amount:</p>
            <input
              type="number"
              value={cryptoAmount}
              onChange={(e) => handleAmountChange(parseInt(e.target.value))}
              min="1"
            />
            <button onClick={confirmAddToPortfolio}>Confirm</button>
          </div>
        </div>
      )}

      {/* Модальное окно с портфелем */}
      {showPortfolioModal && <PortfolioModal onClose={handleClosePortfolioModal} />}
    </div>
  );
};

export default CryptoTable;
