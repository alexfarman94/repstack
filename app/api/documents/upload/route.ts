import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_TEXT_LENGTH = 50;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: {
    fileName?: string;
    fileBase64?: string;
    mimeType?: string;
    title?: string;
    doc_type?: string;
    account_id?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { fileName, fileBase64, mimeType, title, doc_type, account_id } = body;

  if (!fileBase64) return NextResponse.json({ error: 'fileBase64 is required' }, { status: 400 });
  if (!mimeType) return NextResponse.json({ error: 'mimeType is required' }, { status: 400 });

  const buffer = Buffer.from(fileBase64, 'base64');

  if (buffer.length > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File exceeds 5MB limit' }, { status: 400 });
  }

  let text = '';

  try {
    if (mimeType === 'text/plain') {
      text = buffer.toString('utf-8');
    } else if (
      mimeType.includes('wordprocessingml') ||
      mimeType.includes('docx') ||
      fileName?.endsWith('.docx')
    ) {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return NextResponse.json(
        { error: `Unsupported file type: ${mimeType}. Please upload a .txt or .docx file.` },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: 'Failed to parse file' }, { status: 500 });
  }

  if (text.trim().length < MIN_TEXT_LENGTH) {
    return NextResponse.json(
      { error: 'Extracted text is too short — the file may be empty or unreadable.' },
      { status: 400 }
    );
  }

  const docTitle = title?.trim() || fileName?.replace(/\.[^/.]+$/, '') || 'Uploaded document';

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('documents')
    .insert({
      user_id: userId,
      title: docTitle,
      content: text.trim(),
      doc_type: doc_type || 'other',
      account_id: account_id || null,
      char_count: text.trim().length,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
