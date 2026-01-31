import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // Serve from content/questions/<slug>/meta.json + content.md
  const contentDir = path.join(process.cwd(), 'content', 'questions');
  if (!fs.existsSync(contentDir)) {
    return NextResponse.json([], { status: 200 });
  }

  const slugs = fs.readdirSync(contentDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
  const questions: any[] = [];
  for (const slug of slugs) {
    try {
      const metaPath = path.join(contentDir, slug, 'meta.json');
      const contentPath = path.join(contentDir, slug, 'content.md');
      let meta: any = {};
      let content = '';
      if (fs.existsSync(metaPath)) meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      if (fs.existsSync(contentPath)) {
        content = fs.readFileSync(contentPath, 'utf-8');
        // rewrite relative images
        content = content.replace(/!\[([^\]]*)\]\(\.\/([^\)]+)\)/g, (_, alt, pth) => `![${alt}](/questions/${slug}/${pth})`);
      }
      questions.push({ ...meta, content, slug });
    } catch (err) {
      console.warn('Failed to load question', slug, err);
    }
  }

  console.log('Serving', questions.length, 'questions from content/questions');
  return NextResponse.json(questions);
}
