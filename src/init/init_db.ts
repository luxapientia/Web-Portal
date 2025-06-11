import { AppConfigModel } from '../models/AppConfig';
import { PlanModel } from '../models/Plan';
import { TeamCommisionLevelModel } from '../models/TeamCommisionLevel';

import app_config from '../../data/init/appConfig.json';
import vip_plan from '../../data/init/plans.json';
import team_commision_levels from '../../data/init/teamCommisionLevels.json';

const init_db = async () => {
    const appConfig = await AppConfigModel.findOne({});
    if (!appConfig) {
        await AppConfigModel.create(app_config);
    }
    const plan = await PlanModel.findOne({});
    if (!plan) {
        await PlanModel.create(vip_plan);
    }
    const teamCommisionLevels = await TeamCommisionLevelModel.findOne({});
    if (!teamCommisionLevels) {
        await TeamCommisionLevelModel.create(team_commision_levels);
    }
}

export default init_db;