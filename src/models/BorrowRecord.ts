import mongoose, { Schema, models } from 'mongoose';

const BorrowSchema = new Schema({
  memberId: { type: String, required: true },
  bookId: { type: String, required: true },
  bookTitle: { type: String, required: true },
  bookCover: { type: String, required: true },
  borrowDate: { type: String, required: true },
  returnDate: { type: String, default: null },
  status: {
    type: String,
    enum: ['Dipinjam', 'Dikembalikan'],
    default: 'Dipinjam',
  },
});

export const BorrowModel =
  models.BorrowRecord || mongoose.model('BorrowRecord', BorrowSchema);