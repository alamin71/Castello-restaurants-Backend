import { model, Schema } from 'mongoose';

const counterSchema = new Schema({
  _id: { type: String },
  seq: { type: Number, default: 10000 },
});

const Counter = model('Counter', counterSchema);

export const getNextSequence = async (name: string): Promise<number> => {
  // Create with seq: 10000 only if document doesn't exist yet
  await Counter.updateOne(
    { _id: name },
    { $setOnInsert: { seq: 10000 } },
    { upsert: true }
  );
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true }
  );
  return counter!.seq;
};
