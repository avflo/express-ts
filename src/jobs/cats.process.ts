import { Logger } from 'winston'
import { Job, DoneCallback } from "bull"
import { Container } from 'typedi'
import catsService from '../services/cats/cats.service'
import House from '../models/house.model'

export default async (job: Job, done: DoneCallback) => {
    
    const logger:Logger = Container.get('logger')
    const cats = Container.get(catsService)

    try{

        const trackId = job.data.tracing_id
        const catProcessName = job.data.process
        
        logger.info("⛏🤖 Working on: %s | Traicing: %s TRY #%i  Job Data: %s", catProcessName, trackId, job.attemptsMade, job.data)

        
        // REQUEST TO BOT
        let response: any = await cats.doRequest(job.data.request, job.data.path) 
            
        if(!response || response.status != 200 || !response.data ||  response.data?.code != 200) {
            logger.warn("⚠ %s REQUEST | Resp: %o, Traicing: %s", catProcessName, response.data, trackId)

            if(job.opts.attempts && (job.attemptsMade >= job.opts.attempts-1)){

                let houseRecord = await House.findOne({uuid: trackId}).exec()
                if(houseRecord){
                    await houseRecord.update( {
                        $push: {
                            error:{
                                    name: job.data.name || 'no name',
                                    payload: {error: true, message: response.data ? response.data : ''},
                                    job: `${job.id}`
                                }
                        }
                    } )
                }

            }

            throw new Error(`${catProcessName} fails - trackid: ${trackId} `)

        } 
     
        logger.info('😻CAT %s RESPONSE OK... UPDATE DB RECORD...', catProcessName)


        const cat = await House.findOne({uuid: trackId}).exec();

        if(!cat){
            throw new Error(`cant find house to update record in DB - trackid: ${trackId} `)
        }     
   
        const updated =  await cat.update({
                                        $push: {
                                            cats:{
                                                    name: job.data.name,
                                                    payload: response.data,
                                                    job: `${job.id}`
                                                }
                                            }
                                        }) 
        
        if(!updated){
            throw new Error(`cant update record in DB - trackid: ${trackId} `)
        }

        logger.info('🏁 %s JOB FINISHED', catProcessName)

        done(null, {trackId, data: response.data})
    }
    catch(e){
        logger.error(e)
        done(e)
    }
}