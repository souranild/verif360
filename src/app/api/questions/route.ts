import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const questionsDir = path.join(process.cwd(), 'public', 'data', 'questions');
  const files = fs.readdirSync(questionsDir).filter((file) => file.endsWith('.json') && !file.includes('TEMPLATE'));
  const questions = files.map((file) => {
    const filePath = path.join(questionsDir, file);
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return undefined;
    }
  }).filter(Boolean);
  return NextResponse.json(questions);
}
