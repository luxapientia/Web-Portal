import { AppConfigModel } from '../models/AppConfig';
import { TeamCommisionLevelModel } from '../models/TeamCommisionLevel';
import { TrustPlanModel } from '../models/TrustPlan';
import { InterestMatrixModel } from '../models/InterestMatrix';
import { InvitationSettingModel } from '../models/InvitationSetting';
import { WithdrawWalletModel } from '../models/WithdrawWallet';


import app_config from '../../data/init/appConfig.json';
import team_commision_levels from '../../data/init/teamCommisionLevels.json';
import trust_plan from '../../data/init/trustPlan.json';
import interest_matrix from '../../data/init/interestMatrix.json';
import invitation_setting from '../../data/init/invitationSetting.json';
import { walletService } from '../services/Wallet';
import { encryptPrivateKey } from '../utils/encrypt';

const init_db = async () => {
    const appConfig = await AppConfigModel.findOne({});
    if (!appConfig) {
        await AppConfigModel.create(app_config);
    }
    const teamCommisionLevels = await TeamCommisionLevelModel.findOne({});
    if (!teamCommisionLevels) {
        await TeamCommisionLevelModel.create(team_commision_levels);
    }
    const trustPlan = await TrustPlanModel.findOne({});
    if (!trustPlan) {
        await TrustPlanModel.create(trust_plan);
    }

    const interestMatrix = await InterestMatrixModel.findOne({});
    if (!interestMatrix) {
        await InterestMatrixModel.create(interest_matrix);
    }

    const invitationSetting = await InvitationSettingModel.findOne({});
    if (!invitationSetting) {
        await InvitationSettingModel.create(invitation_setting);
    }

    const walletAddresses = await WithdrawWalletModel.find({});
    const ethereumWallet = walletAddresses.find(wallet => wallet.chain === 'Ethereum');
    if (!ethereumWallet) {
        const newEthereumWallet = await walletService.generateWalletCredentials('Ethereum');
        await WithdrawWalletModel.create({
            address: newEthereumWallet.address,
            privateKeyEncrypted: encryptPrivateKey(newEthereumWallet.privateKey),
            chain: 'Ethereum'
        });
    }
    const tronWallet = walletAddresses.find(wallet => wallet.chain === 'Tron');
    if (!tronWallet) {
        const newTronWallet = await walletService.generateWalletCredentials('Tron');
        await WithdrawWalletModel.create({
            address: newTronWallet.address,
            privateKeyEncrypted: encryptPrivateKey(newTronWallet.privateKey),
            chain: 'Tron'
        });
    }
    const bscWallet = walletAddresses.find(wallet => wallet.chain === 'Binance');
    if (!bscWallet) {
        const newBscWallet = await walletService.generateWalletCredentials('Binance');
        await WithdrawWalletModel.create({
            address: newBscWallet.address,
            privateKeyEncrypted: encryptPrivateKey(newBscWallet.privateKey),
            chain: 'Binance'
        });
    }
}

export default init_db;