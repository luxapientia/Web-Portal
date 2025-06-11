// <reference types="@types/tronweb" />
import { ethers } from 'ethers';
const TronWeb = require('tronweb');
import QRCode from 'qrcode';
import { SystemTokenModel } from '../models/System_Token';
import { WalletCredentials } from '../schemas/wallet.schema';
import { config } from '../config';

export class WalletService {
    /**
     * Generate wallet credentials for a specific chain
     * @param chain - The chain to generate credentials for (BSC, Ethereum, or TRON)
     * @returns Promise<WalletCredentials>
     */
    public async generateWalletCredentials(chain: string): Promise<WalletCredentials> {
        const walletConfig = config.wallet.supportedChains[chain as keyof typeof config.wallet.supportedChains];
        if (!walletConfig) {
            throw new Error(`Unsupported chain: ${chain}`);
        }

        switch (walletConfig.type) {
            case 'EVM':
                return this.createEvmWallet();
            case 'TRON':
                return this.createTronWallet();
            default:
                throw new Error(`Unsupported chain type: ${walletConfig.type}`);
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
            const tronWeb = new TronWeb({
                fullHost: 'https://api.trongrid.io',
                eventServer: 'https://api.someotherevent.io',
                privateKey: 'AD71C52E0FC0AB0DFB13B3B911624D4C1AB7BDEFAD93F36B6EF97DC955577509'
            });

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
        const walletConfig = config.wallet.supportedChains[chain as keyof typeof config.wallet.supportedChains];
        if (!walletConfig) {
            throw new Error(`Unsupported chain: ${chain}`);
        }

        try {
            switch (walletConfig.type) {
                case 'EVM':
                    return ethers.utils.isAddress(address);
                case 'TRON':
                    return TronWeb.isAddress(address);
                default:
                    return false;
            }
        } catch {
            return false;
        }
    }

    public async sweepEvmToken(userPrivateKey: string, tokenAddress: string, toAddress: string, amount: number) {
        console.log(userPrivateKey, tokenAddress, toAddress, amount);
        return true;
        // const wallet = new ethers.Wallet(userPrivateKey);
        // const token = new ethers.Contract(tokenAddress, ERC20ABI, wallet);
        // const tx = await token.transfer(toAddress, amount);
        // return tx;
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

export const walletService = new WalletService();