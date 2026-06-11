"use client"

import { z } from "zod"

const loginSchema = z.object({
    email: z
    .string()
    .min(1, 'E-mail jest wymagany')
    .email("Prosze podać poprawny adres e-mail")
    ,
    password: z
    .string()
    .min(1, 'Hasło jest wymagane')
    .min(6, 'Hasło musi mieć co najmniej 6 znaków')
})

export type LoginFormValues  = z.infer<typeof loginSchema>

export default loginSchema