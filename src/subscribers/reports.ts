import { EventSubscriber, On } from 'event-dispatch';
import { events } from './events';
import { Logger } from 'winston';
import { Container } from 'typedi';

@EventSubscriber()
export class docEventSubscriber {

    @On(events.reports.reportsRequest)
    public onObdStart(activity: Object): void {
        const Logger: Logger = Container.get('logger');
        Logger.info(`📋 Report Request | ${events.reports.reportsRequest}:`);
        Logger.info(`${events.reports.reportsRequest} => Activity Info:`, activity); 
    }
}