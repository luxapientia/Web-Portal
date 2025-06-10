import { ChainConfig } from '../types/wallet.types';

export const CHAIN_CONFIGS: Record<string, ChainConfig> = {
  BSC: {
    type: 'EVM',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    chainId: 56,
  },
  Ethereum: {
    type: 'EVM',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID', // Replace with your Infura Project ID
    chainId: 1,
  },
  TRON: {
    type: 'TRON',
    rpcUrl: 'https://api.trongrid.io',
    tronWeb: {
      fullHost: 'https://api.trongrid.io'
    }
  }
}; 