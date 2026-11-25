import mongoose, { Schema, models } from 'mongoose';

const BookSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  cover: { type: String, required: true },
  pdf: { type: String, required: true },
  isPopular: { type: Boolean, default: false },
});

export const BookModel =
  models.Book || mongoose.model('Book', BookSchema);