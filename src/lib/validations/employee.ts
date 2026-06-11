import { z } from "zod";

export const createEmployeeSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Imię musi mieć min. 2 znaki")
    .max(50, "Imię jest za długie"),
  lastName: z
    .string()
    .trim()
    .min(2, "Nazwisko musi mieć min. 2 znaki")
    .max(50, "Nazwisko jest za długie"),
  email: z.string().trim().email("Nieprawidłowy adres email"),
  password: z
    .string()
    .min(6, "Hasło musi mieć min. 6 znaków")
    .max(100, "Hasło jest za długie"),
});

export type CreateEmployeeValues = z.infer<typeof createEmployeeSchema>;