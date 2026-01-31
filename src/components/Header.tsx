"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';
import type { StudyNode } from '@/types';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [study, setStudy] = useState<StudyNode | null>(null);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/study')
      .then((r) => r.json())
      .then((data) => setStudy(data))
      .catch(() => setStudy(null));
  }, []);

  return (
    <header className="bg-[var(--brand-blue)] text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <a href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-[var(--brand-blue)] font-bold">V</div>
              <span className="font-bold text-lg">Verif360</span>
            </a>

            <nav className="hidden md:flex items-center space-x-4 ml-6">
              <a href="/questions" className="hover:underline">Problems</a>
              <button onClick={() => setOpen((s) => !s)} className="hover:underline">Study Plan ▾</button>
              <a href="/blog" className="hover:underline">Blogs</a>
            </nav>

            {/* mobile hamburger */}
            <div className="md:hidden ml-4">
              <button aria-label="Toggle menu" onClick={() => setMobileOpen((s) => !s)} className="p-2 rounded-md hover:bg-white/10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <form onSubmit={(e) => { e.preventDefault(); router.push(`/search?q=${encodeURIComponent(searchTerm)}`); }}>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search problems, blogs..."
                  className="px-3 py-2 rounded text-black w-72 bg-white placeholder-gray-500 border border-gray-200"
                />
              </form>
            </div>
            <Button variant="secondary" size="sm">Sign In</Button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--brand-blue)] text-white border-t border-white/10">
          <div className="px-4 py-3 space-y-2">
            <a href="/questions" className="block px-2 py-1 rounded hover:bg-white/10">Problems</a>
            <button onClick={() => setOpen((s) => !s)} className="w-full text-left px-2 py-1 rounded hover:bg-white/10">Study Plan ▾</button>
            <a href="/blog" className="block px-2 py-1 rounded hover:bg-white/10">Blogs</a>
            <div className="pt-2">
              <form onSubmit={(e) => { e.preventDefault(); setMobileOpen(false); router.push(`/questions?q=${encodeURIComponent(searchTerm)}`); }}>
                <input type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search" className="w-full px-3 py-2 rounded bg-white text-black" />
              </form>
            </div>
          </div>
        </div>
      )}

      {open && study && (
        <div className="bg-white text-black shadow-md border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-3 gap-6">
              {study.children?.map((cat) => (
                <div key={cat.id}>
                  <h4 className="font-semibold">{cat.title}</h4>
                  <ul className="mt-2 space-y-1">
                    {cat.children?.map((topic) => (
                      <li key={topic.id}>
                        <a href={`/study/${topic.slug}`} className="text-sm text-muted-foreground hover:text-foreground">{topic.title}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
