import { Schema } from 'mongoose';

export interface IProduct {
  _id: string,
  name: string,
  description: string,
  category: string,
  price: number,
  createdBy: Schema.Types.ObjectId
}