import { Schema } from "mongoose"

export interface IUser {
  _id: Schema.Types.ObjectId,
  email: string,
  password: string,
  name: string,
  address: {
    street: string,
    number: number
  }
  role: string,
}