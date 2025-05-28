import { Collection, ObjectId } from 'mongodb'
import { getDb } from '@/lib/db'
import { User, UserCollection, CreateUserInput } from '@/models/User'

export class UserService {
  private collection: Promise<Collection<User>>

  constructor() {
    this.collection = this.getCollection()
  }

  private async getCollection(): Promise<Collection<User>> {
    const db = await getDb()
    return db.collection<User>(UserCollection)
  }

  async findById(id: string): Promise<User | null> {
    const collection = await this.collection
    return collection.findOne({ _id: new ObjectId(id) })
  }

  async findByEmail(email: string): Promise<User | null> {
    const collection = await this.collection
    return collection.findOne({ email })
  }

  async create(user: CreateUserInput): Promise<User> {
    const collection = await this.collection
    const now = new Date()
    const newUser = {
      ...user,
      phone: '',  // Will be updated later
      idPassport: '',  // Will be updated later
      isEmailVerified: false,
      isPhoneVerified: false,
      isIdVerified: false,
      role: 'user' as const,
      status: 'pending' as const,
      idDocuments: {
        idFront: '',
        idBack: '',
        selfie: ''
      },
      createdAt: now,
      updatedAt: now,
    }
    const result = await collection.insertOne(newUser as User)
    return { ...newUser, _id: result.insertedId }
  }

  async update(id: string, update: Partial<User>): Promise<boolean> {
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