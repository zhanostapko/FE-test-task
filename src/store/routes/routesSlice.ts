import { RawRouteResponse, RouteData } from "@/types/routes";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  Slice,
} from "@reduxjs/toolkit";

interface RouteState {
  current: RouteData | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: RouteState = {
  current: null,
  status: "idle",
  error: null,
};

export const fetchRoute = createAsyncThunk<
  RouteData,
  { unitId: string; from: string; till: string }
>("route/fetchRoute", async ({ unitId, from, till }) => {
  const key = import.meta.env.VITE_MAPON_API_KEY as string;
  const baseUrl = import.meta.env.VITE_MAPON_API_URL as string;

  const url =
    `${baseUrl}/route/list.json` +
    `?key=${key}&unit_id=${unitId}&from=${from}&till=${till}` +
    `&include=decoded_route`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json: RawRouteResponse = await res.json();
  const unit = json.data.units[0];
  if (!unit) throw new Error("No data for this unit");

  const routeWithPoints = unit.routes.find(
    (r) => r.type === "route" && r.decoded_route?.points?.length
  );

  // TODO: Calculate driving time, idling time/average speed

  let polyline: { lat: number; lng: number }[] = [];
  let distanceKm = 0;
  let drivingTimeSec = 0;
  let idlingTimeSec = 0;

  if (routeWithPoints) {
    polyline = routeWithPoints.decoded_route!.points.map(({ lat, lng }) => ({
      lat,
      lng,
    }));
    distanceKm = +(routeWithPoints.distance ?? 0) / 1_000;
    drivingTimeSec = routeWithPoints.driving_time ?? 0;
    idlingTimeSec = routeWithPoints.idling_time ?? 0;
  } else {
    const stops = unit.routes.filter((r) => r.type === "stop");

    stops.forEach((s, i) => {
      if (i === 0 && s.start?.lat != null && s.start?.lng != null) {
        polyline.push({ lat: s.start.lat, lng: s.start.lng });
      }

      const point =
        s.end?.lat != null && s.end?.lng != null
          ? { lat: s.end.lat, lng: s.end.lng }
          : s.start?.lat != null && s.start?.lng != null
          ? { lat: s.start.lat, lng: s.start.lng }
          : null;

      if (point) polyline.push(point);
    });
  }

  return {
    unitId: unit.unit_id,
    polyline,
    distanceKm,
    drivingTimeSec,
    idlingTimeSec,
  };
});

const routeSlice: Slice<RouteState> = createSlice({
  name: "route",
  initialState,
  reducers: {
    resetRoute: (s) => {
      s.current = null;
      s.status = "idle";
      s.error = null;
    },
  },
  extraReducers: (b) =>
    b
      .addCase(fetchRoute.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchRoute.fulfilled, (s, a: PayloadAction<RouteData>) => {
        s.status = "idle";
        s.current = a.payload;
      })
      .addCase(fetchRoute.rejected, (s) => {
        s.status = "failed";
        s.error = "Unknown error";
      }),
});

export const { resetRoute } = routeSlice.actions;

export default routeSlice.reducer;
