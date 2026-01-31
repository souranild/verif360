import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const contentDir = path.join(process.cwd(), 'content', 'study');
  const indexPath = path.join(contentDir, 'index.json');
  try {
    if (!fs.existsSync(indexPath)) {
      return NextResponse.json({ error: 'Study materials not found' }, { status: 404 });
    }
    const raw = fs.readFileSync(indexPath, 'utf-8');
    const parsed = JSON.parse(raw);
    console.log('Serving study materials from content/study');
    return NextResponse.json(parsed);
  } catch (err) {
    console.error('Failed to load study materials', err);
    return NextResponse.json({ error: 'Unable to load study materials' }, { status: 500 });
  }
}
