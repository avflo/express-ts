import expressLoader from './express';
import Logger from './logger';
import dependencyInjectorLoader from './dependencyInjector'
import mongooseLoader from './mongoose';
import './events'

export default async ({ expressApp }) => {

    const mongoConnection = await mongooseLoader();
    Logger.info('✌️ MongoDB loaded and connected!');
    
    const reportModel = {
        name: 'ReportModel',
        // Notice the require syntax and the '.default'
        model: await require('../models/report.model').default,
    };

    const countryModel = {
        name: 'CountryModel',
        // Notice the require syntax and the '.default'
        model: await require('../models/country.model').default,
    };

    const recallDetailModel = {
        name: 'RecallDetailModel',
        // Notice the require syntax and the '.default'
        model: await require('../models/recall.detail.model').default,
    };

    const recallVinModel = {
        name: 'RecallVinModel',
        // Notice the require syntax and the '.default'
        model: await require('../models/recall.vin.model').default,
    };

    await dependencyInjectorLoader({
        mongoConnection,
        models: [
          reportModel,
          countryModel,
          recallDetailModel,
          recallVinModel
        ],
    });
    Logger.info('✌️ Dependencies loaded');

    await expressLoader({ app: expressApp });
    Logger.info('✌️ Express loaded');
};
