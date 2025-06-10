export interface WalletCredentials {
  address: string;
  privateKey: string;
}

export type ChainType = 'EVM' | 'TRON';

export interface TronWebConfig {
  fullHost: string;
}

export interface ChainConfig {
  type: ChainType;
  rpcUrl: string;
  chainId?: number;
  tronWeb?: TronWebConfig;
} 