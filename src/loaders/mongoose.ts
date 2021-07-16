import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '../config';



export default async (): Promise<Db> => {
  const connection = await mongoose.connect(config.databaseURL , {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

  function handler(){
    connection.connection.close(() => {
      console.info('Database connection disconnected through app termination');
      process.exit(0);
    });
  }
  
  process.on('SIGINT', handler);
  process.on('SIGTERM', handler);

  return connection.connection.db;
};
