import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // Serve from content/blogs/<slug>/meta.json + content.md
  const contentDir = path.join(process.cwd(), 'content', 'blogs');
  if (!fs.existsSync(contentDir)) {
    return NextResponse.json([], { status: 200 });
  }

  const slugs = fs.readdirSync(contentDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
  const blogs: any[] = [];
  for (const slug of slugs) {
    try {
      const metaPath = path.join(contentDir, slug, 'meta.json');
      const contentPath = path.join(contentDir, slug, 'content.md');
      let meta: any = {};
      let content = '';
      if (fs.existsSync(metaPath)) meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      if (fs.existsSync(contentPath)) {
        content = fs.readFileSync(contentPath, 'utf-8');
        content = content.replace(/!\[([^\]]*)\]\(\.\/([^\)]+)\)/g, (_, alt, pth) => `![${alt}](/blogs/${slug}/${pth})`);
      }
      // Determine featured image: prefer meta.featured_image, else pick from tags or slug via Unsplash source
      let featured = '';
      if (meta.featured_image && meta.featured_image.trim().length > 0) {
        featured = meta.featured_image;
      } else {
        const t = (Array.isArray(meta.tags) && meta.tags[0]) || slug || 'verification';
        featured = `https://source.unsplash.com/1600x900/?${encodeURIComponent(String(t))}`;
      }
      blogs.push({ ...meta, content, slug, featured_image: featured });
    } catch (err) {
      console.warn('Failed to load blog', slug, err);
    }
  }

  console.log('Serving', blogs.length, 'blogs from content/blogs');
  return NextResponse.json(blogs);
}
