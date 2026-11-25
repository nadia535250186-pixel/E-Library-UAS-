import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import { MemberModel } from '../../../models/Member';
import { BookModel } from '../../../models/Books';
import { DEFAULT_MEMBERS, initialBooks } from '../../../data/libraryData';

export async function GET() {
  try {
    await connectDB();

    const memberCount = await MemberModel.countDocuments();
    if (memberCount === 0) {
      await MemberModel.insertMany(
        DEFAULT_MEMBERS.map((member) => {
          const copy: Record<string, unknown> = { ...member };
          delete copy.id;
          if (!copy.password) {
            copy.password = '123456';
          }
          return copy;
        })
      );
    }

    const bookCount = await BookModel.countDocuments();
    if (bookCount === 0) {
      await BookModel.insertMany(
        initialBooks.map((book) => {
          const copy: Record<string, unknown> = { ...book };
          delete copy.id;
          return copy;
        })
      );
    }

    return NextResponse.json({
      status: 'Berhasil terhubung ke MongoDB Atlas!',
      totalMembers: await MemberModel.countDocuments(),
      totalBooks: await BookModel.countDocuments(),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Terjadi kesalahan pada server';
    return NextResponse.json(
      { status: 'Gagal terhubung ke MongoDB', error: message },
      { status: 500 }
    );
  }
}