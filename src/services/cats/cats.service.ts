import { Service, Inject } from 'typedi';
import axios from 'axios';
import config from '../../config';

// CAT LIST
const cats: Array<any> = [
    {
        name: '200',
        path: '200',
        process: 'CAT200',
    },
    {
        name: '300',
        path: '300',
        process: 'CAT300'
    },
    {
        name: '400',
        path: '400',
        process: 'CAT400'
    },
    {
        name: '500',
        path: '500',
        process: 'CAT500'
    },
]
@Service()
export default class robotsService {

    constructor(
        @Inject('logger') private logger
    ){}
    
    public async doRequest(payload: any, path: string):Promise<any>{

        try{

            const response = await axios.post(`https://http.cat/${path}`, payload,
                                            {
                                                headers: { 
                                                    'content-type': 'application/json',
                                                }
                                            })
                                            .then(resp => { return resp})
                                            .catch(e => {
                                                this.logger.warn("🔥 ERROR CAT REQUEST: %s %o", path, e.message)
                                                return null;
                                            });
            return response

        }catch(e){
            this.logger.warn("ERROR - payload: %o, %o", payload, e)
            return null
        }
    }

    public catList(): Array<any>{

        // clone array
        let list:Array<any> = [...cats]
        return list

    }

    public cat(name: string){
        return cats.find(e => e.name === name)
    }

}