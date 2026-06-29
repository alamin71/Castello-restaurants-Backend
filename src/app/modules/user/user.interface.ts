import { Model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';
export type IUser = {
  name: string;
  role: USER_ROLES;
  email?: string;
  password?: string;
  phone?: string;
  phoneVerified?: boolean;
  image?: string;
  isDeleted: boolean;
  stripeCustomerId: string;
  status: 'active' | 'blocked';
  verified: boolean;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number | null;
    expireAt: Date | null;
    pendingEmail?: string;
    emailChangeOtp?: number | null;
    emailChangeExpireAt?: Date | null;
    phoneOtp?: number | null;
    phoneOtpExpireAt?: Date | null;
  };
};

export type UserModel = {
  isExistUserById(id: string): Promise<IUser | null>;
  isExistUserByEmail(email: string): Promise<IUser | null>;
  isExistUserByPhone(phone: string): Promise<IUser | null>;
  isMatchPassword(password: string, hashPassword: string): Promise<boolean>;
} & Model<IUser>;
