import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action to fetch products with pagination
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ category, skip, search }) => {
    let url = `https://dummyjson.com/products?limit=8&skip=${skip}`;

    if (category) url = `https://dummyjson.com/products/category/${category}?limit=8&skip=${skip}`;

    if(search) url = `https://dummyjson.com/products/search?q=${search}&limit=8&skip=${skip}`

    const response = await axios.get(url);
    return response.data.products;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    status: 'idle',
    page: 0, // Track pagination
    hasMore: true,
  },
  reducers: {
    resetProducts: (state) => {
      state.products = [];
      state.page = 0;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products.push(...action.payload); // Append new products to the list
        state.status = 'succeeded';
        if (action.payload.length < 8) state.hasMore = false;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { resetProducts } = productsSlice.actions;

export default productsSlice.reducer;
