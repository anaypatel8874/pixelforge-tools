/**
 * Server-side OCR endpoint.
 *
 * This exists so deployments can swap in a stronger OCR engine (e.g. hosted
 * vision API) without touching the client. By default it returns a 501 with
 * a clear message that the client-side Tesseract.js fallback should be used.
 *
 * To enable a real provider:
 *   1. Add your provider's SDK to package.json.
 *   2. Replace the `notImplemented` branch with the real call.
 *   3. Validate mime, size, and rate-limit (see commented section).
 */
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
  const len = Number(req.headers.get('content-length') ?? '0');
  const max = Number(process.env.MAX_UPLOAD_BYTES ?? 20 * 1024 * 1024);
  if (len > max) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  }

  const form = await req.formData();
  const file = form.get('file');
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 });
  }

  // No provider configured. Tell the client to use the local fallback.
  return NextResponse.json(
    {
      text: '',
      message:
        'Server OCR is not configured. The client uses Tesseract.js locally — please run OCR in the browser.',
    },
    { status: 501 }
  );
}
