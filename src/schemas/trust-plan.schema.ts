import { z } from 'zod';

export const trustPlanSchema = z.object({
    name: z.string().min(1, 'Plan name is required'),
    duration: z.number().int().min(1, 'Duration must be at least 1 day'),
    dailyInterestRate: z.number().min(0, 'Interest rate must be positive').max(100, 'Interest rate cannot exceed 100%'),
});

export type TrustPlanFormData = z.infer<typeof trustPlanSchema>; 