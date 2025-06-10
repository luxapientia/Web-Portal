import { z } from 'zod';

// Schema for a single price update
export const CryptoPriceSchema = z.object({
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
export const CryptoPricesSchema = z.array(CryptoPriceSchema);

// Infer TypeScript types from the schemas
export type CryptoPrice = z.infer<typeof CryptoPriceSchema>;
export type CryptoPrices = z.infer<typeof CryptoPricesSchema>;
