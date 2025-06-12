import { AppConfigModel } from '../models/AppConfig';
import { TeamCommisionLevelModel } from '../models/TeamCommisionLevel';
import { TrustPlanModel } from '../models/TrustPlan';
import { InterestMatrixModel } from '../models/InterestMatrix';
import { InvitationSettingModel } from '../models/InvitationSetting';


import app_config from '../../data/init/appConfig.json';
import team_commision_levels from '../../data/init/teamCommisionLevels.json';
import trust_plan from '../../data/init/trustPlan.json';
import interest_matrix from '../../data/init/interestMatrix.json';
import invitation_setting from '../../data/init/invitationSetting.json';

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
}

export default init_db;