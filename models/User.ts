import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  full_name: string;
  email: string;
  password: string;
  verified: boolean;
}

const UserSchema: Schema<IUser> = new Schema({
  full_name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
