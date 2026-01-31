"use client";

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QuestionCard from '@/components/QuestionCard';
import Card from '@/components/Card';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = (searchParams?.get('q') || '').trim();
  const [questions, setQuestions] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/questions').then(r => r.json()).then(setQuestions).catch(() => setQuestions([]));
    fetch('/api/blogs').then(r => r.json()).then(setBlogs).catch(() => setBlogs([]));
  }, []);

  const query = q.toLowerCase();

  const matchedQuestions = useMemo(() => {
    if (!query) return questions;
    return questions.filter((qq) => {
      const title = (qq.title || '').toLowerCase();
      const desc = (qq.description || '').toLowerCase();
      const content = (qq.content || '').toLowerCase();
      const tags = (qq.tags || []).join(' ').toLowerCase();
      const companies = (qq.companies || []).map((c: any) => (c.name || '')).join(' ').toLowerCase();
      return title.includes(query) || desc.includes(query) || content.includes(query) || tags.includes(query) || companies.includes(query);
    });
  }, [questions, query]);

  const matchedBlogs = useMemo(() => {
    if (!query) return blogs;
    return blogs.filter((b) => {
      const title = (b.title || '').toLowerCase();
      const excerpt = (b.excerpt || '').toLowerCase();
      const content = (b.content || '').toLowerCase();
      const tags = (b.tags || []).join(' ').toLowerCase();
      return title.includes(query) || excerpt.includes(query) || content.includes(query) || tags.includes(query);
    });
  }, [blogs, query]);

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-4">Search results for "{q}"</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">Problems ({matchedQuestions.length})</h2>
            <div className="bg-card border border-border rounded-md overflow-hidden">
              {matchedQuestions.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">No matching problems.</div>
              ) : (
                <ul className="divide-y divide-border">
                  {matchedQuestions.map((mq: any, idx: number) => (
                    <li key={mq.slug} className="p-3">
                      <QuestionCard q={mq} index={idx + 1} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Blogs ({matchedBlogs.length})</h2>
            <div className="space-y-3">
              {matchedBlogs.length === 0 ? (
                <div className="p-6 bg-card border border-border rounded-md text-muted-foreground">No matching blogs.</div>
              ) : (
                matchedBlogs.map((b: any) => (
                  <Link key={b.slug} href={`/blog/${b.slug}`} className="block">
                    <Card className="cursor-pointer">
                      <h3 className="font-semibold text-foreground">{b.title}</h3>
                      <p className="text-sm text-muted-foreground">{b.excerpt}</p>
                      <div className="text-sm text-muted-foreground mt-2">By {b.author}</div>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
