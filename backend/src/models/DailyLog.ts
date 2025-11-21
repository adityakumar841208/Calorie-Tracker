import mongoose, { Document, Schema } from 'mongoose';

export interface IFoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
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
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
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
