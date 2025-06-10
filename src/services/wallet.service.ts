import { ethers } from 'ethers';
import TronWeb from 'tronweb';
import QRCode from 'qrcode';
import { WalletCredentials, ChainType } from '../types/wallet.types';
import { CHAIN_CONFIGS } from '../config/chains.config';
import { SystemTokenModel } from '../models/System_Token';

export class WalletService {
  /**
   * Generate wallet credentials for a specific chain
   * @param chain - The chain to generate credentials for (BSC, Ethereum, or TRON)
   * @returns Promise<WalletCredentials>
   */
  public async generateWalletCredentials(chain: string): Promise<WalletCredentials> {
    const config = CHAIN_CONFIGS[chain];
    if (!config) {
      throw new Error(`Unsupported chain: ${chain}`);
    }

    switch (config.type) {
      case 'EVM':
        return this.createEvmWallet();
      case 'TRON':
        return this.createTronWallet();
      default:
        throw new Error(`Unsupported chain type: ${config.type}`);
    }
  }

  /**
   * Create an EVM-compatible wallet (for Ethereum and BSC)
   * @private
   * @returns Promise<WalletCredentials>
   */
  private async createEvmWallet(): Promise<WalletCredentials> {
    try {
      const wallet = ethers.Wallet.createRandom();
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create EVM wallet: ${error.message}`);
      }
      throw new Error('Failed to create EVM wallet: Unknown error');
    }
  }

  /**
   * Create a TRON wallet
   * @private
   * @returns Promise<WalletCredentials>
   */
  private async createTronWallet(): Promise<WalletCredentials> {
    try {
      const fullHost = CHAIN_CONFIGS.TRON.tronWeb?.fullHost;
      if (!fullHost) {
        throw new Error('TRON configuration is missing');
      }

      // Initialize TronWeb with the full host
      const tronWeb = new (TronWeb as any)(
        fullHost,  // fullNode
        fullHost,  // solidityNode
        fullHost   // eventServer
      );

      const account = await tronWeb.createAccount();
      return {
        address: account.address.base58,
        privateKey: account.privateKey,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create TRON wallet: ${error.message}`);
      }
      throw new Error('Failed to create TRON wallet: Unknown error');
    }
  }

  /**
   * Generate QR code for a wallet address
   * @param address - The wallet address to generate QR code for
   * @returns Promise<string> - The QR code as a data URL
   */
  public async generateQRCode(address: string): Promise<string> {
    try {
      return await QRCode.toDataURL(address);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate QR code: ${error.message}`);
      }
      throw new Error('Failed to generate QR code: Unknown error');
    }
  }

  /**
   * Validate if an address is valid for a specific chain
   * @param address - The address to validate
   * @param chain - The chain to validate against
   * @returns boolean
   */
  public isValidAddress(address: string, chain: string): boolean {
    const config = CHAIN_CONFIGS[chain];
    if (!config) {
      throw new Error(`Unsupported chain: ${chain}`);
    }

    try {
      switch (config.type) {
        case 'EVM':
          return ethers.isAddress(address);
        case 'TRON':
          return (TronWeb as any).isAddress(address);
        default:
          return false;
      }
    } catch {
      return false;
    }
  }

  /**
   * Get supported tokens for a specific chain
   * @param chain - The chain to get supported tokens for
   * @returns Promise<Array<string>>
   */
  public async getSupportedTokens(chain: string): Promise<Array<string>> {
    try {
      const tokens = await SystemTokenModel.find({ chain }, { token: 1 });
      return tokens.map(t => t.token);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to get supported tokens: ${error.message}`);
      }
      throw new Error('Failed to get supported tokens: Unknown error');
    }
  }
} 