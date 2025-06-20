// <reference types="@types/tronweb" />
import { ethers } from 'ethers';
const TronWeb = require('tronweb');
import QRCode from 'qrcode';
import { SystemTokenModel } from '../models/System_Token';
import { WalletCredentials } from '../schemas/wallet.schema';
import { config } from '../config';

export interface TransactionDetails {
    status: 'notStarted' | 'pending' | 'success' | 'failed';
    chain: 'Binance' | 'Ethereum' | 'Tron';
    fromAddress?: string;         // sender address
    toAddress?: string;           // recipient address
    token?: string;               // e.g., 'USDT', 'USDC', 'ETH', etc.
    tokenContract?: string;       // ERC20/TRC20 contract address (optional)
    amount?: number;              // decimal format (e.g., 100.00)
    decimals?: number;            // token decimals (optional)
    fee?: string;                 // stringified fee (e.g., '0.00042')
    rawTxHash: string;            // original transaction hash
    blockNumber?: number;         // mined block number if available
    confirmedAt?: Date;           // block timestamp (if retrievable)
}

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

    public async getEvmTxDetails(txHash: string, chain: 'Binance' | 'Ethereum'): Promise<TransactionDetails> {
        const ERC20_ABI = [
            'function symbol() view returns (string)',
            'function decimals() view returns (uint8)',
            'event Transfer(address indexed from, address indexed to, uint256 value)'
        ];

        const walletConfig = config.wallet.supportedChains[chain as keyof typeof config.wallet.supportedChains];
        if (!walletConfig) {
            throw new Error(`Unsupported chain: ${chain}`);
        }

        console.log(config.wallet.supportedChains[chain as keyof typeof config.wallet.supportedChains].rpcUrl, '----------------')

        const provider = new ethers.providers.JsonRpcProvider(config.wallet.supportedChains[chain as keyof typeof config.wallet.supportedChains].rpcUrl);
        const tx = await provider.getTransaction(txHash);

        if (!tx) {
            return { status: 'notStarted', chain: chain, rawTxHash: txHash };
        }

        const receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt) return { status: 'pending', chain: chain, rawTxHash: txHash };

        if (receipt.status === 0) {
            return { status: 'failed', chain: chain, rawTxHash: txHash };
        }

        const iface = new ethers.utils.Interface(ERC20_ABI);
        const log = receipt.logs.find((log) => {
            try {
                iface.parseLog(log);
                return true;
            } catch {
                return false;
            }
        });

        if (!log) {
            return {
                status: 'success',
                chain: chain,
                rawTxHash: txHash,
                fromAddress: tx.from,
                toAddress: tx.to!,
                token: 'Native',
                amount: Number(ethers.utils.formatEther(tx.value)),
                fee: ethers.utils.formatEther(receipt.gasUsed.mul(tx.gasPrice!)),
                blockNumber: receipt.blockNumber
            };
        }

        const parsedLog = iface.parseLog(log);
        const tokenAddress = log.address;
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

        const [symbol, decimals] = await Promise.all([
            tokenContract.symbol(),
            tokenContract.decimals()
        ]);

        return {
            status: 'success',
            chain: chain,
            rawTxHash: txHash,
            fromAddress: parsedLog.args.from,
            toAddress: parsedLog.args.to,
            token: symbol,
            tokenContract: tokenAddress,
            amount: Number(ethers.utils.formatUnits(parsedLog.args.value, decimals)),
            decimals,
            fee: ethers.utils.formatEther(receipt.gasUsed.mul(tx.gasPrice!)),
            blockNumber: receipt.blockNumber
        };

    }

    public async getTronTxDetails(txHash: string): Promise<TransactionDetails> {
        const tronWeb = new TronWeb({
            fullHost: 'https://api.trongrid.io',
            eventServer: 'https://api.someotherevent.io',
            privateKey: 'AD71C52E0FC0AB0DFB13B3B911624D4C1AB7BDEFAD93F36B6EF97DC955577509'
        });
    
        const tx = await tronWeb.trx.getTransaction(txHash).catch(() => null);
        if (!tx) return { status: 'notStarted', chain: 'Tron', rawTxHash: txHash };
    
        const status = tx.ret?.[0]?.contractRet;
        const info = await tronWeb.trx.getTransactionInfo(txHash).catch(() => null);
        if (!info) return { status: 'pending', chain: 'Tron', rawTxHash: txHash };
        if (status !== 'SUCCESS') return { status: 'failed', chain: 'Tron', rawTxHash: txHash };
    
        const contractType = tx.raw_data.contract[0].type;
        const contractValue = tx.raw_data.contract[0].parameter.value;
    
        let from: string;
        let to: string;
        let token: string | null = null;
        let tokenContract: string | null = null;
        let amount: number | null = null;
        let decimals: number | null = null;
    
        if (contractType === "TransferContract") {
            // Native TRX transfer
            from = tronWeb.address.fromHex(contractValue.owner_address);
            to = tronWeb.address.fromHex(contractValue.to_address);
            amount = contractValue.amount / 1e6; // TRX has 6 decimals
            token = "TRX";
            tokenContract = null;
            decimals = 6;
    
        } else if (contractType === "TriggerSmartContract") {
            // Likely TRC20 transfer
            from = tronWeb.address.fromHex(contractValue.owner_address);
            tokenContract = tronWeb.address.fromHex(contractValue.contract_address);
    
            const data = contractValue.data;
            const method = data.substring(0, 8);
    
            if (method !== 'a9059cbb') {
                // Not a TRC20 transfer function
                return { status: 'failed', chain: 'Tron', rawTxHash: txHash };
            }
    
            const toHex = '41' + data.substring(8 + 24, 8 + 64);
            to = tronWeb.address.fromHex(toHex);
    
            const amountHex = data.substring(8 + 64, 8 + 128);
            const amountRaw = BigInt('0x' + amountHex);
    
            // Fetch token symbol and decimals from contract
            const contract = await tronWeb.contract().at(tokenContract);
            const [symbolResult, decimalsResult] = await Promise.all([
                contract.symbol().call(),
                contract.decimals().call()
            ]);
    
            token = symbolResult;
            decimals = parseInt(decimalsResult);
            amount = Number(amountRaw) / (10 ** decimals);
        } else {
            // Unknown contract type
            return { status: 'failed', chain: 'Tron', rawTxHash: txHash };
        }
    
        return {
            status: 'success',
            chain: 'Tron',
            rawTxHash: txHash,
            fromAddress: from,
            toAddress: to,
            token: token || undefined,
            tokenContract: tokenContract || undefined,
            amount,
            decimals,
            fee: (info.fee / 1e6).toString(),
            blockNumber: info.blockNumber,
            confirmedAt: new Date(info.blockTimeStamp)
        };
    }

    public async getTxDetails(txHash: string, chain: 'Binance' | 'Ethereum' | 'Tron'): Promise<TransactionDetails> {
        const walletConfig = config.wallet.supportedChains[chain as keyof typeof config.wallet.supportedChains];
        if (!walletConfig) {
            throw new Error(`Unsupported chain: ${chain}`);
        }

        switch (walletConfig.type) {
            case 'EVM':
                return this.getEvmTxDetails(txHash, chain as 'Binance' | 'Ethereum');
            case 'TRON':
                return this.getTronTxDetails(txHash);
            default:
                throw new Error(`Unsupported chain type: ${walletConfig.type}`);
        }
    }
}

export const walletService = new WalletService();