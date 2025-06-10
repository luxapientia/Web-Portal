import { z } from 'zod';

// Schema for a single price update
export const PriceUpdateSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  image: z.string(),
  price: z.number().positive(),
  timestamp: z.coerce.date(),
  priceChange: z.object({
    '1h': z.number().optional(),
    '24h': z.number().optional(),
    '7d': z.number().optional()
  })
});

// Schema for batch price updates
export const PriceUpdatesSchema = z.array(PriceUpdateSchema);

// Infer TypeScript types from the schemas
export type PriceUpdate = z.infer<typeof PriceUpdateSchema>;
export type PriceUpdates = z.infer<typeof PriceUpdatesSchema>;


// Socket event names
export const PRICE_EVENTS = {
  SINGLE_UPDATE: 'priceUpdate',
  BATCH_UPDATES: 'priceUpdates'
} as const; 