import { Types } from 'mongoose';

export interface IProductQuery {
  name?: {$regex:  string, $options: string},
  description?: {$regex: string, $options: string},
  category?: any, // Check type
  price?: { $lte: string},
  createdBy?: {$in: Types.ObjectId[]}
}