import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Crypto } from '../types/CryptoTypes';

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: [] as Crypto[],
  reducers: {
    addToPortfolio: (state, action: PayloadAction<Crypto>) => {
      state.push(action.payload);
    },
    removeFromPortfolio: (state, action: PayloadAction<string>) => {
      return state.filter((crypto) => crypto.id !== action.payload);
    },
  },
});

export const { addToPortfolio, removeFromPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;