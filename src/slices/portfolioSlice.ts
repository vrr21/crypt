import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: '1',
      name: 'Solana',
      symbol: 'SOL',
      logo: '/assets/images/solana.png',
      buyPrice: 147.96,
      amount: 1,
    },
    {
      id: '2',
      name: 'Ethereum',
      symbol: 'ETH',
      logo: '/assets/images/ethereum.png',
      buyPrice: 2580,
      amount: 3,
    },
  ],
  cost: 8089.88,
  change: 214.43,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    removeFromPortfolio: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updatePortfolioAmount: (state, action) => {
      const { cryptoId, newAmount } = action.payload;
      const item = state.items.find((crypto) => crypto.id === cryptoId);
      if (item && newAmount > 0) {
        item.amount = newAmount;
      }
    },
    // Добавьте экшен для добавления криптовалюты в портфель
    addToPortfolio: (state, action) => {
      const existingCrypto = state.items.find((item) => item.id === action.payload.id);
      if (existingCrypto) {
        existingCrypto.amount += action.payload.amount;
      } else {
        state.items.push(action.payload);
      }
    },
  },
});

export const { removeFromPortfolio, updatePortfolioAmount, addToPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
