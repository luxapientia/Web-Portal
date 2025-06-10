import mongoose from 'mongoose';
import { AppConfigModel } from '../models/AppConfig';
import { PlanModel } from '../models/Plan';

import app_config from '../../data/init/appConfig.json';
import vip_plan from '../../data/init/plans.json';

const init_db = async () => {
    const appConfig = await AppConfigModel.findOne({});
    if (!appConfig) {
        await AppConfigModel.create(app_config);
    }
    const plan = await PlanModel.findOne({});
    if (!plan) {
        await PlanModel.create(vip_plan);
    }
}

export default init_db;