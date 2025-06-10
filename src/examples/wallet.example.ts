import { WalletService } from '../services/wallet.service';

async function example() {
  const walletService = new WalletService();

  try {
    // Generate EVM wallet (works for both BSC and Ethereum)
    console.log('Generating BSC wallet...');
    const bscWallet = await walletService.generateWalletCredentials('BSC');
    console.log('BSC Wallet:', bscWallet);
    
    // Generate QR code for BSC address
    const bscQR = await walletService.generateQRCode(bscWallet.address);
    console.log('BSC Address QR Code:', bscQR);

    // Generate TRON wallet
    console.log('\nGenerating TRON wallet...');
    const tronWallet = await walletService.generateWalletCredentials('TRON');
    console.log('TRON Wallet:', tronWallet);
    
    // Generate QR code for TRON address
    const tronQR = await walletService.generateQRCode(tronWallet.address);
    console.log('TRON Address QR Code:', tronQR);

    // Validate addresses
    console.log('\nValidating addresses...');
    console.log('Is BSC address valid?', walletService.isValidAddress(bscWallet.address, 'BSC'));
    console.log('Is TRON address valid?', walletService.isValidAddress(tronWallet.address, 'TRON'));

    // Get supported tokens
    console.log('\nGetting supported tokens...');
    const bscTokens = await walletService.getSupportedTokens('BSC');
    console.log('BSC Supported Tokens:', bscTokens);
    
    const tronTokens = await walletService.getSupportedTokens('TRON');
    console.log('TRON Supported Tokens:', tronTokens);

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Unknown error occurred');
    }
  }
}

// Run the example
example(); 