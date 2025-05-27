import { ObjectId } from 'mongodb'

export interface IUser {
  _id?: ObjectId
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export type CreateUserInput = Pick<IUser, 'name' | 'email' | 'password'>

export interface IUserWithoutPassword extends Omit<IUser, 'password'> {}

export const UserCollection = 'users' 