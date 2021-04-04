import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface AppState {
   mapLoaded: boolean;
   countries: string[];
}
const initialState: AppState = {
   mapLoaded: false,
   countries: [],
};

const mapSlice = createSlice({
   name: "mapSlice",
   initialState,
   reducers: {
      setMapLoaded: (state, action: PayloadAction<boolean>) => {
         state.mapLoaded = action.payload;
      },
      setCountries: (state, action: PayloadAction<string[]>) => {
         state.countries = action.payload;
      },
   },
});

export const { setMapLoaded, setCountries } = mapSlice.actions;

export const mapLoaded = (state: RootState) => state.mapSlice.mapLoaded;
export const countries = (state: RootState) => state.mapSlice.countries;

export default mapSlice.reducer;
