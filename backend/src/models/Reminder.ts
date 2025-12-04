import mongoose, { Document, Schema } from 'mongoose';

export interface IReminder extends Document {
  uid: string;
  label: string;
  frequency: number; // in minutes
  enabled: boolean;
  createdAt: Date;
}

const ReminderSchema = new Schema<IReminder>({
  uid: {
    type: String,
    required: true,
    index: true,
  },
  label: {
    type: String,
    required: true,
  },
  frequency: {
    type: Number,
    required: true,
    min: 1, // At least 1 minute
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Reminder = mongoose.model<IReminder>('Reminder', ReminderSchema);
