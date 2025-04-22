import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { UnitsApiResponse, SimpleUnit } from "@/types/units";

interface UnitsState {
  list: SimpleUnit[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: UnitsState = {
  list: [],
  status: "idle",
  error: null,
};

export const fetchUnits = createAsyncThunk<SimpleUnit[], void>(
  "units/fetchUnits",
  async () => {
    const key = import.meta.env.VITE_MAPON_API_KEY as string;
    const baseUrl = import.meta.env.VITE_MAPON_API_URL as string;

    const res = await fetch(`${baseUrl}/unit/list.json?key=${key}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json: UnitsApiResponse = await res.json();
    return json.data.units.map<SimpleUnit>((u) => ({
      unit_id: u.unit_id,
      number: u.number,
      label: u.label,
    }));
  }
);

const unitsSlice = createSlice({
  name: "units",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchUnits.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchUnits.fulfilled,
        (state, { payload }: PayloadAction<SimpleUnit[]>) => {
          state.status = "idle";
          state.list = payload;
        }
      )
      .addCase(fetchUnits.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message ?? "Unknown error";
      }),
});

export default unitsSlice.reducer;
