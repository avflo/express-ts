import { EventDispatcher, EventDispatcherInterface } from '../../subscribers/eventDispatcher';
import { Service, Inject } from 'typedi';
import config from '../../config';
import AWS from 'aws-sdk';
import fs from 'fs'
import path from 'path';

var pjson = require('../../../package.json');


@Service()
export default class utilsService {
    constructor(
        @Inject('logger') private logger,
        @Inject('ReportModel') private Report: any,
        @Inject('CountryModel') private Country: any,
        @Inject('RecallDetailModel') private RecallDetail: any,
        @Inject('RecallVinModel') private RecallVin: any,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface
    ){

    }

    // current app version
    public appVersion(): string{
        return 'version@'+pjson.version;
    }

    // generate random string key
    public generateKey(length:number = 32 , randomString:string = ""): string{

        randomString += Math.random().toString(20).substr(2, length);
        if (randomString.length > length){
            randomString = randomString.slice(0, length)
            this.logger.info('Key generated!', {randomString});
            return randomString;
        }else{
            return this.generateKey(length, randomString);
        }    
    }

    public async createCountry(country): Promise<string|null>{
        try {
            const c = await this.Country.create({
                id: country.id,
                num1: country.num1,
                num2: country.num2,
                codigo: country.codigo,
                pais: country.pais
            })

            return c.id;

        } catch (error) {
           this.logger.error("🔥 CREATE CREATE COUNTRY | ERROR: ", error);
           return null;
        }
    }

    public async createRecallDetail(detail): Promise<string|null>{
        try {
            const d = await this.RecallDetail.create({
                id_campana: detail.id_campaña,
                fecha_campana: detail.fecha_campaña,
                titulo_campana: detail.titulo_campaña,
                afectados: detail.afectados,
                problema: detail.problema,
                descripcion: detail.descripcion,
                riesgo: detail.riesgo,
                link: detail.link
            })
            return d.id_campana;

        } catch (error) {
           this.logger.error("🔥 CREATE RECALL DETAIL | ERROR: ", error);
           return null;
        }
    }

    public async createRecallVin(vin): Promise<string|null>{
        try {
            const v = await this.RecallVin.create({
                id_campana: vin.id_campaña,
                vin: vin.vin,
            })
            return v.id_campana;

        } catch (error) {
           this.logger.error("🔥 CREATE RECALL VIN | ERROR: ", error);
           return null;
        }
    }


    public async s3PDFUpload(b64: string,  fileName: string, path: string){

        try {

            const file = Buffer.from(b64, 'base64')

            const s3 = new AWS.S3({
                accessKeyId: config.S3KeyId,
                secretAccessKey: config.S3SecretKey
            });

            // Setting up S3 upload parameters
            const params = {
                Bucket: `icar-respaldos/informe/${path}`,
                Key: `${fileName}_${config.date}.pdf`, // File name you want to save as in S3
                Body: file
            };

            // Uploading files to the bucket
            s3.upload(params, function(err, data) {
                if (err) {
                    throw err;
                }
                console.log(`File uploaded successfully. ${data.Location}`);
            });

        } catch (error) {
            this.logger.warn('S3 upload PDF fails %o', error );
        }

    }


}
