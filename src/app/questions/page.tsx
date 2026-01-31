"use client";
import Link from "next/link";
import QuestionCard from "@/components/QuestionCard";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

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

  useEffect(() => {
    const q = searchParams?.get('q') || '';
    setQuery(q);
  }, [searchParams]);

  const tags = useMemo(() => {
    const s = new Set<string>();
    questions.forEach((q) => (q.tags || []).forEach((t: string) => s.add(t)));
    return Array.from(s).slice(0, 12);
  }, [questions]);

  const companies = useMemo(() => {
    const s = new Map<string, { name: string; logo: string }>();
    questions.forEach((q) => {
      (q.companies || []).forEach((c: { name: string; logo: string }) => {
        if (!s.has(c.name)) {
          s.set(c.name, c);
        }
      });
    });
    return Array.from(s.values()).slice(0, 12);
  }, [questions]);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchesTag = activeTag ? q.tags.includes(activeTag) : true;
      const matchesQuery = query ? q.title.toLowerCase().includes(query.toLowerCase()) : true;
      const matchesCompany = selectedCompany
        ? q.companies?.some((c: any) => {
            const companyName = typeof c === 'string' ? c : c.name;
            return companyName.toLowerCase() === selectedCompany.toLowerCase();
          })
        : true;
      const matchesDifficulty = selectedDifficulty ? q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase() : true;
      return matchesTag && matchesQuery && matchesCompany && matchesDifficulty;
    });
  }, [questions, query, activeTag, selectedCompany, selectedDifficulty]);

  const openRandomQuestion = () => {
    if (questions.length > 0) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      const randomQuestion = questions[randomIndex];
      router.push(`/questions/${randomQuestion.slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-foreground">Problems</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">{filtered.length} problems</div>
              <button
                onClick={openRandomQuestion}
                className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark"
              >
                Random Question
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex flex-wrap gap-2 py-1">
              <button
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className="px-3 py-1 rounded-full text-sm bg-card text-muted-foreground border border-border"
              >
                {filtersExpanded ? 'Collapse Filters' : 'Expand Filters'}
              </button>
              {filtersExpanded && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveTag(null)}
                      className={`px-3 py-1 rounded-full text-sm ${!activeTag ? 'bg-primary text-white' : 'bg-card text-muted-foreground border border-border'}`}
                    >
                      All Topics
                    </button>
                    {tags.map((t) => (
                      <button
                        key={t}
                        onClick={() => setActiveTag(activeTag === t ? null : t)}
                        className={`px-3 py-1 rounded-full text-sm ${activeTag === t ? 'bg-primary text-white' : 'bg-card text-muted-foreground border border-border'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCompany(null)}
                      className={`px-3 py-1 rounded-full text-sm ${!selectedCompany ? 'bg-primary text-white' : 'bg-card text-muted-foreground border border-border'}`}
                    >
                      All Companies
                    </button>
                    {companies.map((company, index) => (
                      <button
                        key={`${company.name}-${index}`}
                        onClick={() => setSelectedCompany(selectedCompany === company.name ? null : company.name)}
                        className={`px-3 py-1 rounded-full text-sm ${selectedCompany === company.name ? 'bg-primary text-white' : 'bg-card text-muted-foreground border border-border'}`}
                      >
                        {company.name}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedDifficulty(null)}
                      className={`px-3 py-1 rounded-full text-sm ${!selectedDifficulty ? 'bg-primary text-white' : 'bg-card text-muted-foreground border border-border'}`}
                    >
                      All Difficulties
                    </button>
                    {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty)}
                        className={`px-3 py-1 rounded-full text-sm ${selectedDifficulty === difficulty ? 'bg-primary text-white' : 'bg-card text-muted-foreground border border-border'}`}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search problems"
                  className="px-4 py-2 rounded-md bg-card border border-border text-sm w-64 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border shadow-sm rounded-md overflow-hidden">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">No problems found.</div>
            ) : (
              <ul className="divide-y divide-border">
                {filtered.map((q, idx) => (
                  <li
                    key={q.slug}
                    className="p-4 flex items-center justify-between hover:bg-muted/10"
                  >
                    <div className="flex-1">
                      <QuestionCard q={q} index={idx + 1} />
                    </div>
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
