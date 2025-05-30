import { ObjectId } from 'mongodb'

export const UserCollection = 'users'

export interface User {
  _id?: ObjectId
  fullName: string
  email: string
  phone: string
  password: string
  idPassport: string
  invitationCode?: string
  myInvitationCode: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isIdVerified: boolean
  role: 'user' | 'admin'
  status: 'pending' | 'active' | 'suspended'
  idDocuments: {
    idFront: string
    idBack: string
    selfie: string
  }
  createdAt: Date
  updatedAt: Date
}

export type CreateUserInput = Pick<User, 'fullName' | 'email' | 'password'>

export type UserWithoutPassword = Omit<User, 'password'> 