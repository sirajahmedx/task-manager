import mongoose, { Model, Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  image: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: String,
  image: String,
});

const User: Model<IUser> =
  (mongoose.models?.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;