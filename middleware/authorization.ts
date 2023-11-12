import { Request, Response, NextFunction } from 'express';
import * as ProductService from '../services/productService';
import { Types } from 'mongoose';

export const checkProductOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const productId: Types.ObjectId = new Types.ObjectId(req.params.id);
  try {
    const product = await ProductService.getById(productId);

    if (!product) {
      return res.status(404).send(`Product with ID ${productId} not found`);
    }

    if (req.currentUser._id !== product.createdBy && req.currentUser.role !== 'admin') {
      return res.status(403).send('You do not have permission to do that');
    }

    // TODO check if necessary
    (req as any).product = product;
    next();
  } catch (error: any) {
    return res.status(500).send(error.message);
  }
};