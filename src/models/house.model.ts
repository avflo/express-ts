import { IHouseModel, IHouse } from '../interfaces';
import mongoose, { Schema } from 'mongoose';
import { any, string } from 'joi';

const HouseSchema: Schema<IHouse, IHouseModel> = new mongoose.Schema({
  uuid: {
    type: String,
    required: [true, 'Please enter an track id'],
    unique: true,
    index: true,
  },

  name: String,

  error: {
    type: Array,
    default: {
      name: String,
      payload: Object,
      job: String
    }
  },

  cats: {
    type: Array,
    default: {
      name: String,
      payload: Object,
      job: String
    }
  }
},
  { timestamps: true }
);


export default mongoose.model<IHouse, IHouseModel>('House', HouseSchema);