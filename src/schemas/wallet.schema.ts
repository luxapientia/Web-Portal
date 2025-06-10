import { z } from 'zod';

export const walletCredentialsSchema = z.object({
  address: z.string().min(1),
  privateKey: z.string().min(1),
});

export type WalletCredentials = z.infer<typeof walletCredentialsSchema>;