import { configureStore } from "@reduxjs/toolkit";
import unitsReducer from "./units/unitsSlice";
import routeReducer from "./routes/routesSlice";

export const store = configureStore({
  reducer: {
    units: unitsReducer,
    route: routeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
