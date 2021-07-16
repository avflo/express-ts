import { EventDispatcher, EventDispatcherInterface } from '../../subscribers/eventDispatcher';
import { events } from '../../subscribers/events';
import {Service, Inject } from 'typedi';
import { v4 as uuidv4 } from 'uuid';
import CatsService from '../cats/cats.service'


@Service()
export default class Report {
    //reports: Array<any>
    constructor(
        @EventDispatcher() eventDispatcher: EventDispatcherInterface,
        @Inject('logger') private logger: any,
        @Inject('HouseModel') private House: any,
        private cats: CatsService
    ){
    }
    
    public async update(uuid, payload:object){
        try {
            let filter  = {uuid: uuid}
            let house =  await this.House.findOneAndUpdate(filter, payload)
            
            return house
        } catch (error) {
            this.logger.warn('Cant update house on DB: %o', error)
            return null;
        }
    }
    
    /**
     * CREATE A NEW REPORT REQUEST 
     * @param 
     * @returns void
     */

    public async create(name: string): Promise<string|null>{
        try {

            const trackId = uuidv4();
            
            const totalCats: number = this.cats.catList().length || 0

            const report = await this.House.create({
                uuid: trackId,
                client: name,
                error: [],
                cats: []
            })

            return report.uuid;

        } catch (error) {
           this.logger.error("🔥 CREATE HOUSE REQUEST | ERROR: ", error);
           return null;
        }
    }
}