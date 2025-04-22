import { z } from "zod";
import { schema } from "../schemas/formSchema";
export type FormValues = z.infer<typeof schema>;
