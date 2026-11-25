import mongoose, { Schema, models } from 'mongoose';

const MemberSchema = new Schema({
  name: { type: String, required: true },
  nim: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '-' },
  avatar: { type: String, default: '/icons/profile1.png' },
  role: { type: String, default: 'Anggota E-Library' },
  joinDate: { type: String },
  favorites: [{ type: String }],
});

export const MemberModel =
  models.Member || mongoose.model('Member', MemberSchema);