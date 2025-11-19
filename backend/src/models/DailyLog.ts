import mongoose, { Document, Schema } from 'mongoose';

export interface IFoodItem {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  timestamp: Date;
}

export interface IDailyLog extends Document {
  uid: string;
  date: string;
  items: IFoodItem[];
}

const FoodItemSchema = new Schema<IFoodItem>({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number },
  carbs: { type: Number },
  fat: { type: Number },
  timestamp: { type: Date, default: Date.now },
});

const DailyLogSchema = new Schema<IDailyLog>({
  uid: {
    type: String,
    required: true,
    index: true,
  },
  date: {
    type: String,
    required: true,
  },
  items: [FoodItemSchema],
});

DailyLogSchema.index({ uid: 1, date: 1 }, { unique: true });

export const DailyLog = mongoose.model<IDailyLog>('DailyLog', DailyLogSchema);
