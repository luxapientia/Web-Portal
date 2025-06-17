import mongoose, { Schema, Document } from 'mongoose';

export const UserCollection = 'users';

export interface User extends Document {
  _id: string;
  name: string;
  email: string;
  image?: string;
  phone: string;
  password: string;
  idPassport: string;
  invitationCode?: string;
  myInvitationCode: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdVerified: boolean;
  role: 'user' | 'admin';
  status: 'pending' | 'active' | 'suspended';
  idDocuments: {
    idFront: string;
    idBack: string;
    selfie: string;
  };
  withdrawalWallet?: {
    chain: string;
    address: string;
  }[];
  accountValue: {
    totalAssetValue: number,
    totalWithdrawable: number,
    totalDeposited: number,
    totalReleasedInterest: number,
    totalUnreleasedInterest: number,
    totalTrustReleased: number,
    totalInTrustFund: number
  }
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: false, default: null },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  idPassport: { type: String, required: true },
  invitationCode: { type: String },
  myInvitationCode: { type: String, required: true },
  isEmailVerified: { type: Boolean, required: true },
  isPhoneVerified: { type: Boolean, required: true },
  isIdVerified: { type: Boolean, required: true },
  role: { type: String, enum: ['user', 'admin'], required: true },
  status: { type: String, enum: ['pending', 'active', 'suspended'], required: true },
  idDocuments: {
    idFront: { type: String, required: true },
    idBack: { type: String, required: true },
    selfie: { type: String, required: true }
  },
  withdrawalWallet: {
    type: [{
      chain: { type: String, required: true },
      address: { type: String, required: true }
    }],
    required: false,
    default: []
  },
  accountValue: {
    totalAssetValue: { type: Number, required: true, default: 0 },
    totalWithdrawable: { type: Number, required: true, default: 0 },
    totalDeposited: { type: Number, required: true, default: 0 },
    totalReleasedInterest: { type: Number, required: true, default: 0 },
    totalUnreleasedInterest: { type: Number, required: true, default: 0 },
    totalTrustReleased: { type: Number, required: true, default: 0 },
    totalInTrustFund: { type: Number, required: true, default: 0 }
  }
}, {
  timestamps: true,
  collection: UserCollection
});

export const UserModel = mongoose.models[UserCollection] || mongoose.model<User>(UserCollection, UserSchema);

export type CreateUserInput = Pick<User, 'name' | 'email' | 'password'>;
export type UserWithoutPassword = Omit<User, 'password'>;
