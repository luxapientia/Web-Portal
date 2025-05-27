import { Collection, ObjectId } from 'mongodb'
import { getDb } from '@/lib/db'
import { IUser, UserCollection, CreateUserInput } from '@/models/User'

export class UserService {
  private collection: Promise<Collection<IUser>>

  constructor() {
    this.collection = this.getCollection()
  }

  private async getCollection(): Promise<Collection<IUser>> {
    const db = await getDb()
    return db.collection<IUser>(UserCollection)
  }

  async findById(id: string): Promise<IUser | null> {
    const collection = await this.collection
    return collection.findOne({ _id: new ObjectId(id) })
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const collection = await this.collection
    return collection.findOne({ email })
  }

  async create(user: CreateUserInput): Promise<IUser> {
    const collection = await this.collection
    const now = new Date()
    const newUser = {
      ...user,
      createdAt: now,
      updatedAt: now,
    }
    const result = await collection.insertOne(newUser as IUser)
    return { ...newUser, _id: result.insertedId }
  }

  async update(id: string, update: Partial<IUser>): Promise<boolean> {
    const collection = await this.collection
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...update,
          updatedAt: new Date()
        }
      }
    )
    return result.modifiedCount > 0
  }

  async delete(id: string): Promise<boolean> {
    const collection = await this.collection
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }
} 