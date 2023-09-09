import * as mongodb from "mongodb";
import { Product } from "../model/product";
import { IProduct } from "../interfaces/product";
import { Request, Response } from "express";
import { IUser } from "../interfaces/user";
import { User } from "../model/user";
import { Schema } from "mongoose";

const create = async (req: Request, res: Response) => {
  try {
    const result = await Product.create({
      ...req.body,
      createdBy: req.currentUser._id
    });

    if (result) {
      return res.status(201).send(result);
    } else {
      return res.status(500).send("Failed to create a new product.");
    }
  } catch (error: any) {
    console.error(error);
    return res.status(500).send(error.message);
  }
}

const update = async (req: Request, res: Response) => {
  try {
    const id = req?.params?.id;
    const updatedProduct = req.body;
    const query = { _id: new mongodb.ObjectId(id) };

    const product = await Product.findOne(query);

    if (req.currentUser._id !== product?.createdBy && req.currentUser.role !== 'admin') {
      return res.status(403).send('You dont have permission to do that')
    }

    const result = await Product.updateOne(query, { $set: updatedProduct });

    if (result && result.matchedCount) {
      return res.status(200).send(`Updated an product: ID ${id}.`);
    } else if (!result.matchedCount) {
      return res.status(404).send(`Failed to find an product: ID ${id}`);
    } else {
      return res.status(304).send(`Failed to update an product: ID ${id}`);
    }
  } catch (error: any) {
    return res.status(500).send(error.message);
  }
}

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req?.params?.id;
    const query = { _id: new mongodb.ObjectId(id) };

    const product = await Product.findOne(query);

    if (req.currentUser._id !== product?.createdBy && req.currentUser.role !== 'admin') {
      res.status(403).send('You dont have permission to do that')
    }

    const result = await Product.deleteOne(query);

    if (result && result.deletedCount) {
      res.status(202).send(`Removed an product: ID ${id}`);
    } else if (!result) {
      res.status(500).send(`Failed to remove an product: ID ${id}`);
    } else if (!result.deletedCount) {
      res.status(404).send(`Failed to find an product: ID ${id}`);
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

const getById = async (req: Request, res: Response) => {
  try {
    const id = req?.params?.id;
    const query = { _id: new mongodb.ObjectId(id) };
    const product = await Product.findOne(query);

    if (product) {
      return res.status(200).send(product);
    } else {
      return res.status(404).send(`Failed to find an product: ID ${id}`);
    }
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
    let usersIds: Schema.Types.ObjectId[] = [];
    if (req.query?.createdBy) {
      users = await User.find({ name: { "$regex": req.query.createdBy, "$options": "i" } })
      usersIds = users.map(user => user._id)
    }

    let query = {
      ...(req.query?.name ? { name: { "$regex": req.query.name, "$options": "i" } } : {}),
      ...(req.query?.description ? { description: { "$regex": req.query.description, "$options": "i" } } : {}),
      ...(req.query?.category ? { category: req.query.category } : {}),
      ...(req.query?.price ? { price: { $lte: req.query.price } } : {}),
      ...(req.query?.createdBy ? { createdBy: { $in: usersIds } } : {}),
    }


    const products: IProduct[] = await Product.find(query).exec();
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