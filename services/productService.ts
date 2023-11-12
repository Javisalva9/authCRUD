import { Product } from "../model/product";
import { IProduct } from "../interfaces/product";
import { IProductQuery } from "../interfaces/productsQuery";
import { Types, Document } from 'mongoose';

export const getAll = async (query: IProductQuery): Promise<IProduct[]> => {
  return await Product.find(query).exec();
};

export const create = async (product: IProduct, createdBy: Types.ObjectId) => {
  return await Product.create({
    ...product,
    createdBy
  });
};

export const getById = async (id: Types.ObjectId): Promise<IProduct | null> => {
  return await Product.findById(id);
};

export const update = async (id: Types.ObjectId, product: IProduct): Promise<IProduct | null> => {
  return await Product.findByIdAndUpdate(id, product);
};

export const deleteProduct = async (id: Types.ObjectId): Promise<IProduct | null> => {
  return await Product.findByIdAndDelete(id);
};
