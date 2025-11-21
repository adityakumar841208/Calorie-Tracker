import mongoose, { Document, Schema } from 'mongoose';

export type UserGoal = 'lose' | 'maintain' | 'gain';

export interface IUser extends Document {
  uid: string;
  goal: UserGoal;
  targetCalories: number;
  weight: number;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  goal: {
    type: String,
    enum: ['lose', 'maintain', 'gain'],
    required: true,
  },
  targetCalories: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model<IUser>('User', UserSchema);
