import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url || !/^https?:\/\/.+/i.test(url)) {
    return new NextResponse('URL PDF tidak valid', { status: 400 });
  }

  try {
    const parsedUrl = new URL(url);

    const response = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        Accept: 'application/pdf,application/octet-stream,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
        Referer: `${parsedUrl.origin}/`,
      },
    });

    if (!response.ok) {
      return new NextResponse(
        `Gagal mengambil PDF dari sumber (${response.status}). Pastikan URL PDF masih aktif dan dapat diakses publik.`,
        { status: response.status }
      );
    }

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('PDF Proxy Error:', error);
    return new NextResponse('Terjadi kesalahan saat memuat file PDF', {
      status: 500,
    });
  }
}
