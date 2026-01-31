
import { Blog, Question, Course, StudyNode } from '@/types';
import fs from 'fs';
import path from 'path';

// Helper to read all JSON files in a directory (server-side only)
function importAllJsonFromDir(dir: string): any[] {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((file) => file.endsWith('.json') && !file.includes('TEMPLATE'));
  return files.map((file) => {
    const filePath = path.join(dir, file);
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.warn('Failed to load JSON:', filePath, err);
      return undefined;
    }
  }).filter(Boolean);
}

export async function fetchBlogs(): Promise<Blog[]> {
  const contentBlogsDir = path.join(process.cwd(), 'content', 'blogs');
  const publicBlogsDir = path.join(process.cwd(), 'public', 'data', 'blogs');

  const results: Blog[] = [];

  // Prefer content/blogs/<slug>/meta.json + content.md
  if (fs.existsSync(contentBlogsDir)) {
    const slugs = fs.readdirSync(contentBlogsDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
    for (const slug of slugs) {
      try {
        const metaPath = path.join(contentBlogsDir, slug, 'meta.json');
        const contentPath = path.join(contentBlogsDir, slug, 'content.md');
        let meta: any = {};
        let contentStr = '';
        if (fs.existsSync(metaPath)) {
          meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
        }
        if (fs.existsSync(contentPath)) {
          let raw = fs.readFileSync(contentPath, 'utf-8');
          // Rewrite relative images ./images/foo -> /blogs/<slug>/images/foo
          raw = raw.replace(/!\[([^\]]*)\]\(\.\/([^\)]+)\)/g, (_, alt, pth) => `![${alt}](/blogs/${slug}/${pth})`);
          contentStr = raw;
        }

        // Determine featured image: prefer meta.featured_image, else pick from tags or slug via Unsplash source
        let featured = '';
        if (meta.featured_image && meta.featured_image.trim().length > 0) {
          featured = meta.featured_image;
        } else {
          const t = (Array.isArray(meta.tags) && meta.tags[0]) || slug || 'verification';
          featured = `https://source.unsplash.com/1600x900/?${encodeURIComponent(String(t))}`;
        }

        results.push({
          title: meta.title || 'Untitled',
          author: meta.author || 'Unknown',
          date: meta.date || '',
          content: contentStr || meta.content || '',
          tags: Array.isArray(meta.tags) ? meta.tags : [],
          slug: slug,
          excerpt: meta.excerpt || meta.description || '',
          featured_image: featured,
          status: meta.status || 'published',
        });
      } catch (err) {
        console.warn('Failed to load content blog', slug, err);
      }
    }
  }

  // Fallback to older public/data/blogs if any remain (for backward compatibility)
  if (fs.existsSync(publicBlogsDir)) {
    const oldBlogs = importAllJsonFromDir(publicBlogsDir);
    for (const b of oldBlogs) {
      if (!b || typeof b.title !== 'string') continue;
      results.push({
        title: b.title || 'Untitled',
        author: b.author || 'Unknown',
        date: b.date || '',
        content: b.content || '',
        tags: Array.isArray(b.tags) ? b.tags : [],
        slug: b.slug || generateSlug(b.title || 'Untitled'),
        excerpt: b.excerpt || b.description || '',
        featured_image: b.featured_image || '',
        status: b.status || 'published',
      });
    }
  }

  return results;
}

export async function fetchQuestions(): Promise<Question[]> {
  const contentDir = path.join(process.cwd(), 'content', 'questions');
  const publicDir = path.join(process.cwd(), 'public', 'data', 'questions');

  const results: Question[] = [];

  if (fs.existsSync(contentDir)) {
    const slugs = fs.readdirSync(contentDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
    for (const slug of slugs) {
      try {
        const metaPath = path.join(contentDir, slug, 'meta.json');
        const contentPath = path.join(contentDir, slug, 'content.md');
        let meta: any = {};
        let contentStr = '';
        if (fs.existsSync(metaPath)) meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
        if (fs.existsSync(contentPath)) {
          let raw = fs.readFileSync(contentPath, 'utf-8');
          raw = raw.replace(/!\[([^\]]*)\]\(\.\/([^\)]+)\)/g, (_, alt, pth) => `![${alt}](/questions/${slug}/${pth})`);
          contentStr = raw;
        }

        const canonicalSlug = meta.slug || slug;
        results.push({
          title: meta.title || 'Untitled',
          difficulty: meta.difficulty ? (meta.difficulty.charAt(0).toUpperCase() + meta.difficulty.slice(1)) : 'Easy',
          tags: Array.isArray(meta.tags) ? meta.tags : [],
          description: meta.description || meta.excerpt || '',
          examples: Array.isArray(meta.examples) ? meta.examples : [],
          constraints: meta.constraints || '',
          hints: Array.isArray(meta.hints) ? meta.hints : [],
          solution: meta.solution || { language: '', code: '' },
          acceptance_rate: typeof meta.acceptance_rate === 'number' ? meta.acceptance_rate : 0,
          submissions: typeof meta.submissions === 'number' ? meta.submissions : 0,
          companies: Array.isArray(meta.companies) ? meta.companies : [],
          content: contentStr,
          slug: canonicalSlug,
          _dir: slug,
        });
      } catch (err) {
        console.warn('Failed to load question', slug, err);
      }
    }
  }

  // fallback to public/data/questions for backward compatibility
  if (fs.existsSync(publicDir)) {
    const old = importAllJsonFromDir(publicDir);
    for (const q of old) {
      if (!q || typeof q.title !== 'string') continue;
      const slug = q.slug || generateSlug(q.title || 'Untitled');
      results.push({
        title: q.title || 'Untitled',
        difficulty: q.difficulty ? (q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)) : 'Easy',
        tags: Array.isArray(q.tags) ? q.tags : [],
        description: q.description || '',
        examples: Array.isArray(q.examples) ? q.examples : [],
        constraints: q.constraints || '',
        hints: Array.isArray(q.hints) ? q.hints : [],
        solution: q.solution || { language: '', code: '' },
        acceptance_rate: typeof q.acceptance_rate === 'number' ? q.acceptance_rate : 0,
        submissions: typeof q.submissions === 'number' ? q.submissions : 0,
        companies: Array.isArray(q.companies) ? q.companies : [],
        content: q.content || '',
        slug,
      });
    }
  }

  console.log('fetchQuestions: returning', results.length, 'questions');
  return results;
}

export async function fetchCourses(): Promise<Course[]> {
  const contentCoursesDir = path.join(process.cwd(), 'content', 'courses');
  const publicCoursesDir = path.join(process.cwd(), 'public', 'data', 'courses');
  const results: Course[] = [];

  if (fs.existsSync(contentCoursesDir)) {
    const slugs = fs.readdirSync(contentCoursesDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
    for (const slug of slugs) {
      try {
        const metaPath = path.join(contentCoursesDir, slug, 'meta.json');
        const contentPath = path.join(contentCoursesDir, slug, 'content.md');
        let meta: any = {};
        let contentStr = '';
        if (fs.existsSync(metaPath)) meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
        if (fs.existsSync(contentPath)) contentStr = fs.readFileSync(contentPath, 'utf-8');
        results.push({
          title: meta.title || 'Untitled',
          instructor: meta.instructor || 'Unknown',
          description: meta.description || '',
          modules: meta.modules || [],
          duration: meta.duration || 0,
          level: meta.level || 'intermediate',
          price: meta.price || 0,
          enrollment_count: meta.enrollment_count || 0,
          rating: meta.rating || 0,
          prerequisites: meta.prerequisites || [],
          slug,
        });
      } catch (err) {
        console.warn('Failed to load course', slug, err);
      }
    }
  }

  // fallback to public data
  if (fs.existsSync(publicCoursesDir)) {
    const oldCourses = importAllJsonFromDir(publicCoursesDir);
    for (const c of oldCourses) {
      if (!c) continue;
      results.push({
        title: c.title || 'Untitled',
        instructor: c.instructor || 'Unknown',
        description: c.description || '',
        modules: c.modules || [],
        duration: c.duration || 0,
        level: c.level || 'intermediate',
        price: c.price || 0,
        enrollment_count: c.enrollment_count || 0,
        rating: c.rating || 0,
        prerequisites: c.prerequisites || [],
        slug: c.slug || generateSlug(c.title || 'untitled'),
      });
    }
  }

  return results;
}

export async function fetchStudyMaterials(): Promise<StudyNode | null> {
  const contentStudyDir = path.join(process.cwd(), 'content', 'study');
  const indexPath = path.join(contentStudyDir, 'index.json');
  try {
    if (!fs.existsSync(indexPath)) {
      return null;
    }
    let raw = fs.readFileSync(indexPath, 'utf-8');
    const parsed = JSON.parse(raw) as StudyNode;

    // For each child, prefer content from content/study/<slug>/content.md
    const children = parsed.children || [];
    for (const child of children) {
      const slug = child.slug;
      const mdPath = path.join(contentStudyDir, slug, 'content.md');
      if (fs.existsSync(mdPath)) {
        try {
          const md = fs.readFileSync(mdPath, 'utf-8');
          // rewrite relative images to /study/<slug>/images/
          child.content = md.replace(/!\[([^\]]*)\]\(\.\/([^\)]+)\)/g, (_, alt, pth) => `![${alt}](/study/${slug}/${pth})`);
        } catch (err) {
          // ignore
        }
      }
    }

    console.log('Serving study materials from content/study with', (parsed.children || []).length, 'topics');
    return parsed as StudyNode;
  } catch (err) {
    console.warn('Failed to load study materials', err);
    return null;
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}
