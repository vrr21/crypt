// src/slices/portfolioSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PortfolioItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  amount: number;
}

interface PortfolioState {
  items: PortfolioItem[];
}

const initialState: PortfolioState = {
  items: [],
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addOrUpdateItem(state, action: PayloadAction<PortfolioItem>) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.amount += action.payload.amount;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateItemAmount(
      state,
      action: PayloadAction<{ id: string; amount: number }>
    ) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item && action.payload.amount > 0) {
        item.amount = action.payload.amount;
      }
    },
  },
});

export const { addOrUpdateItem, removeItem, updateItemAmount } =
  portfolioSlice.actions;

export default portfolioSlice.reducer;
