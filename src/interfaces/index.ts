import { Model, Document } from "mongoose";

export interface IHouse extends Document {
  id: String,
  uuid: String,
  name: String,
  cats: Array<{
    name: String,
    payload: object,
    job: String
  }>,
  error: Array<{
    name: String,
    payload: object,
    job: String
  }>
}

export interface IHouseModel extends Model<IHouse> {}