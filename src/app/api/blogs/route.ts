import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const blogsDir = path.join(process.cwd(), 'public', 'data', 'blogs');
  const files = fs.readdirSync(blogsDir).filter((file) => file.endsWith('.json') && !file.includes('TEMPLATE'));
  const blogs = files.map((file) => {
    const filePath = path.join(blogsDir, file);
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return undefined;
    }
  }).filter(Boolean);
  return NextResponse.json(blogs);
}
