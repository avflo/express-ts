import dotenv from 'dotenv';
import moment from 'moment';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (process.env.NODE_ENV != 'production' && envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  dev: process.env.NODE_ENV !== "production",
  prod: process.env.NODE_ENV == "production",
  port: process.env.PORT || '5000',
  apiKey: process.env.API_KEY,
  date: (moment(new Date()).format("L")).split('/').join('_').trim() || '_x_',
  redisUrl: process.env.REDIS_URL ?  process.env.REDIS_URL : 'local:redis:6379',
  /**
   * Used by winston logger
  */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  /*
    * Data Base
  */
  databaseURL: process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp',
  dbName: process.env.DB_NAME,
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
};