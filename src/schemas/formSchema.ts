import { z } from "zod";
export const schema = z.object({
  vehicleId: z.string().min(1, "Car is required"),
  from: z.string().min(10, "From date is required"),
  to: z.string().min(10, "Till date is required"),
});
