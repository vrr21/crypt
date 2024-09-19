import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import instance from '../api/instance';
import { Crypto } from '../types/CryptoTypes';

interface CryptoState {
  list: Crypto[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: CryptoState = {
  list: [],
  status: 'idle',
};

export const fetchCryptos = createAsyncThunk('cryptos/fetchCryptos', async () => {
  const response = await instance.get('/assets');
  return response.data.data;
});

const cryptoSlice = createSlice({
  name: 'cryptos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptos.pending, (state: CryptoState) => {
        state.status = 'loading';
      })
      .addCase(fetchCryptos.fulfilled, (state: CryptoState, action: PayloadAction<Crypto[]>) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchCryptos.rejected, (state: CryptoState) => {
        state.status = 'failed';
      });
  },
});

export default cryptoSlice.reducer;
