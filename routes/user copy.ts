import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"
import { User } from "../model/user";
import { Request, Response } from "express";
import { IUser } from "../interfaces/user";
import * as mongodb from "mongodb";

const TOKEN_KEY: jwt.Secret = process.env.TOKEN_KEY || ''


const register = async (req: Request, res: Response) => {

  try {
    const { email, role, password, name, address } = req.body;

    if (!(email && password && name)) {
      res.status(400).send("Email/password and name are required");
    }

    const alreadyUser = await User.findOne({ email });

    if (alreadyUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user: IUser | null = await User.create({
      email,
      password: encryptedPassword,
      name,
      ...(address ? { address } : {}),
      role: role || 'user'
    });

    const token = jwt.sign(
      {
        _id: user._id,
        email,
        role: user.role,
        name,
        ...(address ? { address } : {}),
      },
      TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    res.status(201).json({ user, token });
  } catch (err: any) {
    res.status(500).send(`Something went wrong creating user: ${err.message}`);
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    const user: IUser | null = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {
          _id: user._id,
          email,
          role: user.role,
          name: user.name,
          ...(user.address ? user.address : {}),
        },
        TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      res.status(200).json({ user, token });
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err: any) {
    res.status(401).send(`Something went wrong with the login: ${err.message}`);
  }
}

const update = async (req, res) => {
  try {
    const id = req?.params?.id;
    const user = req.body;
    const query = { _id: new mongodb.ObjectId(id) };
    const result = await User.updateOne(query, { $set: user });

    if (result && result.matchedCount) {
      res.status(200).send(`Updated an user: ID ${id}.`);
    } else if (!result.matchedCount) {
      res.status(404).send(`Failed to find an user: ID ${id}`);
    } else {
      res.status(304).send(`Failed to update an user: ID ${id}`);
    }
  } catch (error: any) {
    res.status(400).send(error.message);
  }
}

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req?.params?.id;
    const query = { _id: new mongodb.ObjectId(id) };
    const result = await User.deleteOne(query);

    if (result && result.deletedCount) {
      res.status(202).send(`Removed an user: ID ${id}`);
    } else if (!result) {
      res.status(400).send(`Failed to remove an user: ID ${id}`);
    } else if (!result.deletedCount) {
      res.status(404).send(`Failed to find an user: ID ${id}`);
    }
  } catch (error: any) {
    res.status(400).send(error.message);
  }
}

const getAll = async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find();
    res.status(200).json(users);
  } catch (error: any) {
    console.log(error);
    res.status(400).send(error.message);
  }
}

module.exports = {
  register,
  login,
  update,
  deleteUser,
  getAll
};