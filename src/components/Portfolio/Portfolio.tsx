import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PortfolioModal from './PortfolioModal';
import './Portfolio.css';

const Portfolio: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const portfolioCost = useSelector((state: any) => state.portfolio.cost);
  const portfolioChange = useSelector((state: any) => state.portfolio.change);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="portfolio-summary" onClick={handleOpenModal}>
        <p>Portfolio cost: {portfolioCost} $</p>
        <p>Portfolio change: {portfolioChange} $</p>
      </div>

      {isModalOpen && <PortfolioModal onClose={handleCloseModal} />}
    </div>
  );
};

export default Portfolio;
