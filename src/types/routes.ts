export type DecodedPoint = {
  gmt: string;
  lat: number;
  lng: number;
  speed?: number;
};

export type AddressStructured = {
  country: string;
  countryCode: string;
  city: string;
  postCode: string;
  street: string;
  house: string;
  district: string;
  state: string;
  region: string;
};

export type CanData = {
  fuel_level: number;
  service_distance: number;
  total_distance: number;
  total_fuel: number;
  total_engine_hours: number;
};

export type MaponRoute = {
  type: "route" | "stop";
  route_id: number;
  driving_time?: number;
  idling_time?: number;
  start: {
    time: string;
    lat: number;
    lng: number;
    address?: string;
    address_structured?: AddressStructured;
    can?: CanData;
  };
  end: {
    time: string;
    lat?: number;
    lng?: number;
    address?: string;
    address_structured?: AddressStructured;
    can?: CanData;
  };
  avg_speed?: number;
  max_speed?: number;
  decoded_route?: { points: DecodedPoint[] };
  distance?: number;
  countries?: Array<{ code: string; distance: number; time: number }>;
  driver_id?: number;
  route_details?: Record<string, unknown>;
  route_fields?: Record<string, string>;
};

export type UnitWithRoutes = {
  unit_id: number;
  routes: MaponRoute[];
};

export type RawRouteResponse = {
  data: {
    units: UnitWithRoutes[];
  };
};

export type RouteData = {
  unitId: number;
  polyline: { lat: number; lng: number }[];
  distanceKm: number;
  drivingTimeSec: number;
  idlingTimeSec: number;
};
