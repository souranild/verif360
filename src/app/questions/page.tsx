"use client";
import Link from "next/link";
import QuestionCard from "@/components/QuestionCard";

import { useEffect, useMemo, useState } from "react";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then((data) => {
        console.log('Loaded questions:', data.length);
        setQuestions(data || []);
      })
      .catch((err) => {
        console.error('Failed to load questions', err);
        setQuestions([]);
      });
  }, []);

  const tags = useMemo(() => {
    const s = new Set<string>();
    questions.forEach((q) => (q.tags || []).forEach((t: string) => s.add(t)));
    return Array.from(s).slice(0, 12);
  }, [questions]);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (activeTag && !(q.tags || []).includes(activeTag)) return false;
      if (!query) return true;
      const ql = query.toLowerCase();
      return (q.title || '').toLowerCase().includes(ql) || (q.description || '').toLowerCase().includes(ql) || (q.tags || []).some((t: string) => t.toLowerCase().includes(ql));
    });
  }, [questions, query, activeTag]);

  return (
    <div className="min-h-screen bg-background">
      <div className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-foreground">Problems</h1>
            <div className="text-sm text-muted-foreground">{filtered.length} problems</div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex overflow-x-auto gap-2 py-1">
              <button onClick={() => setActiveTag(null)} className={`px-3 py-1 rounded-full text-sm ${!activeTag ? 'bg-primary text-white' : 'bg-card text-muted-foreground border border-border'}`}>
                All Topics
              </button>
              {tags.map((t) => (
                <button key={t} onClick={() => setActiveTag(activeTag === t ? null : t)} className={`px-3 py-1 rounded-full text-sm ${activeTag === t ? 'bg-primary text-white' : 'bg-card text-muted-foreground border border-border'}`}>
                  {t}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="relative">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search problems" className="px-4 py-2 rounded-md bg-card border border-border text-sm w-64 focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border shadow-sm rounded-md overflow-hidden">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">No problems found.</div>
            ) : (
              <ul className="divide-y divide-border">
                {filtered.map((q, idx) => (
                  <li key={q.slug} className="p-3">
                    <QuestionCard q={q} index={idx + 1} />
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
