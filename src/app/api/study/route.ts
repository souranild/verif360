import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const studyDir = path.join(process.cwd(), 'public', 'data', 'study');
  const indexPath = path.join(studyDir, 'index.json');
  try {
    const raw = fs.readFileSync(indexPath, 'utf-8');
    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json({ error: 'Unable to load study materials' }, { status: 500 });
  }
}
