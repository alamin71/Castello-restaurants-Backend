import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { model, Schema } from 'mongoose';
import config from '../../../config';
import { USER_ROLES, USER_STATUS } from '../../../enums/user';
import AppError from '../../../errors/AppError';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
      default: 'User',
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
      minlength: 8,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    stripeCustomerId: {
      type: String,
      default: '',
    },
    authentication: {
      type: {
        isResetPassword: {
          type: Boolean,
          default: false,
        },
        oneTimeCode: {
          type: Number,
          default: null,
        },
        expireAt: {
          type: Date,
          default: null,
        },
        phoneOtp: {
          type: Number,
          default: null,
        },
        phoneOtpExpireAt: {
          type: Date,
          default: null,
        },
      },
      select: false,
    },
  },
  { timestamps: true }
);

// Exist User Check
userSchema.statics.isExistUserById = async (id: string) => {
  return await User.findById(id);
};

userSchema.statics.isExistUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

userSchema.statics.isExistUserByPhone = async (phone: string) => {
  return await User.findOne({ phone });
};

// Password Matching
userSchema.statics.isMatchPassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
};

// Pre-Save Hook for Hashing Password
userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds)
    );
  }
  next();
});

// Query Middleware
userSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});
export const User = model<IUser, UserModel>('User', userSchema);
