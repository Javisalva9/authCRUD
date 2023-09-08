import { IProduct } from '../interfaces/product'
import { Schema, model } from 'mongoose';

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['gold', 'standard', 'silver'], default: 'standard' },
  price: { type: Number, required: true },
  createdBy: { type: Schema.ObjectId }
});

export const Product = model<IProduct>('Product', productSchema);