
import { Blog, Question, Course, StudyNode } from '@/types';
import fs from 'fs';
import path from 'path';

// Helper to read all JSON files in a directory (server-side only)
function importAllJsonFromDir(dir: string): any[] {
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
  });
}

export async function fetchBlogs(): Promise<Blog[]> {
  const blogsDir = path.join(process.cwd(), 'public', 'data', 'blogs');
  const blogs = importAllJsonFromDir(blogsDir);
  const validBlogs = blogs.filter((blog, i) => {
    const isValid = blog && typeof blog.title === 'string' && Array.isArray(blog.tags);
    if (!isValid) {
      console.warn('Skipping invalid blog at index', i, blog);
    }
    return isValid;
  });
  return validBlogs.map((blog) => ({
    title: blog.title || 'Untitled',
    author: blog.author || 'Unknown',
    date: blog.date || '',
    content: blog.content || '',
    tags: Array.isArray(blog.tags) ? blog.tags : [],
    slug: blog.slug || generateSlug(blog.title || 'Untitled'),
    excerpt: blog.excerpt || blog.description || '',
    featured_image: blog.featured_image || '',
    status: blog.status || 'published',
  }));
}

export async function fetchQuestions(): Promise<Question[]> {
  const questionsDir = path.join(process.cwd(), 'public', 'data', 'questions');
  const questions = importAllJsonFromDir(questionsDir);
  return questions
    .filter((q, i) => {
      const isValid = q && typeof q.title === 'string' && Array.isArray(q.tags);
      if (!isValid) {
        console.warn('Skipping invalid question at index', i, q);
      }
      return isValid;
    })
    .map((q) => ({
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
      slug: q.slug || generateSlug(q.title || 'Untitled'),
    }));
}

export async function fetchCourses(): Promise<Course[]> {
  // @ts-ignore: webpack specific require.context
  const courses = await importAllJson(require.context('../../public/data/courses', false, /\.json$/));
  return courses.map((c) => ({
    ...c,
    slug: generateSlug(c.title),
  }));
}

export async function fetchStudyMaterials(): Promise<StudyNode | null> {
  const studyIndexPath = path.join(process.cwd(), 'public', 'data', 'study', 'index.json');
  try {
    const raw = fs.readFileSync(studyIndexPath, 'utf-8');
    const parsed = JSON.parse(raw);
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
