import { configureStore, combineReducers } from '@reduxjs/toolkit';
import mapSlice from './slices/mapSlice';

const rootReducer = combineReducers({
   mapSlice
});

export type RootState = ReturnType<typeof rootReducer>;

export default configureStore({
   reducer: rootReducer
});
