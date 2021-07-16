import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'
import { Logger } from 'winston'

// Services
import utilsService from '../../services/utils/utils.service'
import houseService from '../../services/house/house.service'
import robotService from '../../services/cats/cats.service'
// Middlewares
import {
    xApiKey,
    rateLimit,
    speedLimit,
    validation,
} from '../middlewares'  

// Schemas
import {  
    houseReqSchema,
} from '../schemas/house'

import robotsQueue from '../../jobs/cats.queue'

const route = Router()

export default(app: Router) => {

    const utilsServiceInstance = Container.get(utilsService)
    const houseServiceInstance = Container.get(houseService)
    const catsServiceInstance = Container.get(robotService)
    
    // get winston logger - check more in loaders
    const logger:Logger = Container.get('logger')


    app.use('/', route)

    // root
    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        try{
            const version = utilsServiceInstance.appVersion()
            
            if(!version){
                throw new Error("Something failed!")
            } 
            
            res.status(200).json({
                data: version,
                message: 'welcome to express ts'
            })        
        } catch(err){
            next(err)
        }
    })

    // random Key
    route.get('/generate/key', async (req: Request, res: Response, next: NextFunction) => {
        try{
            const randomKey = utilsServiceInstance.generateKey()
            
            if(!randomKey){
                throw new Error("Something failed!")
            }
            
            res.status(200).json({
                data: randomKey,
                message: 'Key generated!'
            })
        } catch(err){
            next(err)
        }
    })

    /*
    *********************
    *    RESCUE CATS    *
    *********************
    */

    route.post('/v1/rescue/cats', 
                rateLimit, 
                speedLimit, 
                xApiKey(),
                validation(houseReqSchema), 
                async (req: Request, res: Response, next: NextFunction) => {
        try{

            logger.info("✨ NEW REQUEST | %o", req.body)

            const name: string = `${req.body.name}`

            const trackId: string|null = await houseServiceInstance.create(name)
            
            if (!trackId || trackId == ""){
                throw Error("Could't create a request, track id not generated!")
            }
            
            // get all bot list to queue
            const cats = catsServiceInstance.catList()

            cats.forEach( async botData => {

                const data = {
                    tracing_id: trackId,        // uuid to track status in db
                    name: botData.name,
                    path: botData.path,         // bot path to request
                    process: botData.process,   // simple bot name to identify a bot process
                    request:{
                        identificador: trackId
                    },
                }

                const robotQueue = new robotsQueue(botData.name)
                await robotQueue.addToQueue(data)
            })
            
            logger.info("🏁 QUEUE ADDED! /v1/report/create | %o")

            res.status(200).json({
                ok: true,
                data: {
                    tracing_id: trackId
                }
            })
    
        } catch(error){
            logger.error("🔥 ERROR /v1/report/create | ERROR: ", error)
            return next(error)
        }
    })
}