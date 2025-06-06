import {z} from 'zod'

export const verifySchema = z.object({
    verifyCode: z.string().min(6, {message: 'Verify code must be at least 6 characters'}).max(6, {message: 'Verify code must be at most 6 characters'}).regex(/^[0-9]+$/, "Verify code must be a number")
})