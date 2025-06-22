import { configureStore } from '@reduxjs/toolkit';
import index from './reducers/index';

const store = configureStore({
  reducer: index,
  // no need to add middleware manually unless you're customizing
});

export default store;
