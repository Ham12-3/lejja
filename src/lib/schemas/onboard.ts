import { z } from "zod";

export const configureSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  email: z.string().email("Please enter a valid email"),
  verticals: z.array(z.string()),
  aiCategorization: z.boolean(),
  anomalyScanning: z.boolean(),
});

export type ConfigureFormData = z.infer<typeof configureSchema>;
