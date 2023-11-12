import { IProduct } from "../interfaces/product";
import { Request, Response } from "express";
import { IUser } from "../interfaces/user";
import { User } from "../model/user";
import { Types } from "mongoose";
import { IProductQuery } from "../interfaces/productsQuery";

import * as ProductService from "../services/productService"

const create = async (req: Request, res: Response) => {
  try {
    const result = await ProductService.create(req.body, req.currentUser._id);

    return res.status(201).send(result);
  } catch (error: any) {
    return res.status(500).send(`Failed to create a new product. ${error.message}`);
  }
}

const update = async (req: Request, res: Response) => {
  try {
    const id: Types.ObjectId = new Types.ObjectId(req.params.id);
    const updatedProduct = req.body;

    const result = await ProductService.update(id, updatedProduct)

    if (result) {
      return res.status(200).send(`Updated an product: ID ${id}.`);
    } else {
      const product = await ProductService.getById(id);

      if (!product) {
        return res.status(404).send(`Failed to find an product: ID ${id}`);
      } else {
        return res.status(304).send(`Failed to update an product: ID ${id}`);
      }
    }
  } catch (error: any) {
    return res.status(500).send(error.message);
  }
}

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id: Types.ObjectId = new Types.ObjectId(req.params.id);

    const result = await ProductService.deleteProduct(id);

    if (result) {
      res.status(202).send(`Removed an product: ID ${id}`);
    } else {
      const product = await ProductService.getById(id);

      if (!product) {
        res.status(404).send(`Failed to find an product: ID ${id}`);
      } else {
        res.status(500).send(`Failed to remove an product: ID ${id}`);
      }
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

const getById = async (req: Request, res: Response) => {
  try {
    const id: Types.ObjectId = new Types.ObjectId(req.params.id);

    const product = await ProductService.getById(id)

    if (!product) {
      return res.status(404).send(`Product not found: ID ${req?.params?.id}`);
    }

    return res.status(200).send(product);
  } catch (error) {
    return res.status(404).send(`Failed to find an product: ID ${req?.params?.id}`);
  }
}

// Return all products if no query
// With query:
// name/description regex
// price lower than
// category exact match
// createdBy regex by name of creator
const getAll = async (req: Request, res: Response) => {
  try {
    let users: IUser[];
    let usersIds: Types.ObjectId[] = [];
    if (req.query?.createdBy) {
      users = await User.find({ name: { "$regex": req.query.createdBy, "$options": "i" } })
      usersIds = users.map(user => user._id)
    }

    let query: IProductQuery = {
      ...(req.query?.name ? { name: { "$regex": req.query.name as string, "$options": "i" } } : {}),
      ...(req.query?.description ? { description: { "$regex": req.query.description as string, "$options": "i" } } : {}),
      ...(req.query?.category ? { category: req.query.category } : {}),
      ...(req.query?.price ? { price: { $lte: req.query.price as string } } : {}),
      ...(req.query?.createdBy ? { createdBy: { $in: usersIds } } : {}),
    }

    const products: IProduct[] = await ProductService.getAll(query);
    return res.status(200).send(products);
  } catch (error: any) {
    return res.status(500).send(error.message);
  }
}

module.exports = {
  create,
  getById,
  update,
  deleteProduct,
  getAll
};