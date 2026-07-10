import { model, Schema } from 'mongoose';

const counterSchema = new Schema({
  _id: { type: String },
  seq: { type: Number, default: 10000 },
});

const Counter = model('Counter', counterSchema);

export const getNextSequence = async (name: string): Promise<number> => {
  const counter = await Counter.findByIdAndUpdate(
    name,
    [{ $set: { seq: { $add: [{ $ifNull: ['$seq', 10000] }, 1] } } }],
    { new: true, upsert: true }
  );
  return counter!.seq;
};
