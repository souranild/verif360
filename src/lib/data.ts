import { Blog, Question, Course } from '@/types';
import blogsData from '../../public/data/blogs.json';
import questionsData from '../../public/data/questions.json';
import coursesData from '../../public/data/courses.json';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

export async function fetchBlogs(): Promise<Blog[]> {
  // Simulate async fetch
  return new Promise((resolve) => {
    setTimeout(() => resolve(blogsData as Blog[]), 100);
  });
}

export async function fetchQuestions(): Promise<Question[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const questions = questionsData as Question[];
      const questionsWithSlugs = questions.map((q) => ({
        ...q,
        slug: generateSlug(q.title),
      }));
      resolve(questionsWithSlugs);
    }, 100);
  });
}

export async function fetchCourses(): Promise<Course[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const courses = coursesData as Course[];
      const coursesWithSlugs = courses.map((c) => ({
        ...c,
        slug: generateSlug(c.title),
      }));
      resolve(coursesWithSlugs);
    }, 100);
  });
}