import { z } from 'zod';

// Schema for a single price update
export const PriceUpdateSchema = z.object({
  symbol: z.string(),
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

// Available symbols
export const AVAILABLE_SYMBOLS = ['BTC', 'ETH', 'BNB', 'LTC'] as const;
export const SymbolSchema = z.enum(AVAILABLE_SYMBOLS);
export type Symbol = z.infer<typeof SymbolSchema>;

// Enhanced price update schema with symbol validation
export const ValidatedPriceUpdateSchema = PriceUpdateSchema.extend({
  symbol: SymbolSchema
});

export const ValidatedPriceUpdatesSchema = z.array(ValidatedPriceUpdateSchema);

// Socket event names
export const PRICE_EVENTS = {
  SINGLE_UPDATE: 'priceUpdate',
  BATCH_UPDATES: 'priceUpdates'
} as const; 