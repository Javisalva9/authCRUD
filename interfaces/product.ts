import { Types } from 'mongoose';

export interface IProduct {
  _id: Types.ObjectId,
  name: string,
  description: string,
  category: string,
  price: number,
  createdBy: Types.ObjectId
}