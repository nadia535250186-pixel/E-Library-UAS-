import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '../../../lib/mongodb';
import '../../../models/Books';
import '../../../models/Member';
import '../../../models/BorrowRecord';

function isAuthorized(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  const validKey = process.env.API_SECRET_KEY || 'lafenandher-uas-secret-2026';
  return apiKey === validKey;
}

function getModels() {
  const BookModel =
    mongoose.models.Book ||
    mongoose.models.Books ||
    mongoose.model('Book', new mongoose.Schema({}, { strict: false }));

  const MemberModel =
    mongoose.models.Member ||
    mongoose.models.Members ||
    mongoose.model('Member', new mongoose.Schema({}, { strict: false }));

  const BorrowRecordModel =
    mongoose.models.BorrowRecord ||
    mongoose.models.BorrowRecords ||
    mongoose.model('BorrowRecord', new mongoose.Schema({}, { strict: false }));

  return { BookModel, MemberModel, BorrowRecordModel };
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { message: 'Unauthorized: Invalid x-api-key' },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const { BookModel, MemberModel, BorrowRecordModel } = getModels();

    const [books, members, history] = await Promise.all([
      BookModel.find({}).lean(),
      MemberModel.find({}).lean(),
      BorrowRecordModel.find({}).sort({ _id: -1 }).lean(),
    ]);

    return NextResponse.json({ books, members, history });
  } catch (error) {
    console.error('GET /api/library error:', error);
    return NextResponse.json(
      { message: 'Gagal mengambil data dari MongoDB' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { message: 'Unauthorized: Invalid x-api-key' },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const { BookModel, MemberModel, BorrowRecordModel } = getModels();
    const body = await req.json();
    const { action, payload } = body;

    switch (action) {
      case 'REGISTER_MEMBER': {
        await MemberModel.create(payload);
        return NextResponse.json({ ok: true });
      }
      case 'RESET_PASSWORD': {
        await MemberModel.updateOne(
          { id: payload.id },
          { $set: { password: payload.password, email: payload.email } }
        );
        return NextResponse.json({ ok: true });
      }
      case 'ADD_BOOK': {
        await BookModel.create(payload);
        return NextResponse.json({ ok: true });
      }
      case 'DELETE_BOOK': {
        await BookModel.deleteOne({ id: payload.bookId });
        return NextResponse.json({ ok: true });
      }
      case 'BORROW_BOOK': {
        await BorrowRecordModel.create(payload);
        return NextResponse.json({ ok: true });
      }
      case 'RETURN_BOOK': {
        await BorrowRecordModel.updateMany(
          {
            memberId: payload.memberId,
            bookId: payload.bookId,
            status: 'Dipinjam',
          },
          { $set: { status: 'Dikembalikan', returnDate: payload.returnDate } }
        );
        return NextResponse.json({ ok: true });
      }
      case 'CLEAR_HISTORY': {
        await BorrowRecordModel.deleteMany({
          memberId: payload.memberId,
          status: 'Dikembalikan',
        });
        return NextResponse.json({ ok: true });
      }
      default:
        return NextResponse.json(
          { message: 'Action tidak dikenali' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('POST /api/library error:', error);
    return NextResponse.json(
      { message: 'Gagal menyimpan ke MongoDB' },
      { status: 500 }
    );
  }
}