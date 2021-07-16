import  Bull  from 'bull'; // https://optimalbits.github.io/bull
import axios from 'axios';
import config from '../config';
import { Container } from 'typedi';
import { Logger } from 'winston';

import catsService from '../services/cats/cats.service'
import utilsService from '../services/utils/utils.service'

import catsJob from './cats.process'

 export default class RobotsQueue {
    queue: Bull.Queue
    constructor(
        queueName: string,
        logger: Logger =  Container.get('logger'),
        cats: catsService = Container.get(catsService),
        Report: any = Container.get('ReportModel')
    ){

        this.queue =  new Bull(queueName, `${config.redisUrl}`)
        this.queue.process(catsJob)

        this.queue.on('completed', async function(job: Bull.Job, result: any){

            logger.info('🏁 BOT COMPLETE %o', job.data)
   
        }) 
    }

    public async addToQueue(data: any){
        
        await this.queue.add(data, {
            attempts: 10
        });

        return this.queue.getJobCounts();
    }
    
    public async status(){

        const list = await this.queue.getJobCounts(); 
        const completed =  await this.queue.getJobs(['completed'], -3, -1, true)
        return {
            list,
            completed
        }
    }
}