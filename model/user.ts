import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user'

const userSchema = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  address: {
    street: {type: String},
    number: {type: Number}
  },
  role: {
    type: String, enum: ['admin', 'user'], default: 'user'
  },
});

export const User = model<IUser>('User', userSchema);