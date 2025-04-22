export type UnitsApiResponse = {
  data: {
    units: Unit[];
  };
};

export type Unit = {
  unit_id: number;
  box_id: number;
  company_id: number;
  country_code: string;
  label: string;
  number: string;
  shortcut: string;
  vehicle_title: string | null;
  car_reg_certificate: string;
  vin: string | null;
  type: string;
  icon: string | null;
  lat: number;
  lng: number;
  direction: number;
  speed: number | null;
  mileage: number;
  last_update: string;
  ignition_total_time: number;
  state: UnitState;
  movement_state: UnitState;
  fuel_type: string;
  avg_fuel_consumption: FuelConsumption;
  created_at: string;
};

export type UnitState = {
  name: string;
  start: string;
  duration: number;
  debug_info: Record<string, unknown>;
};

export type FuelConsumption = {
  norm: number;
  measurement: string;
};

export type SimpleUnit = Pick<Unit, "unit_id" | "number" | "label">;
