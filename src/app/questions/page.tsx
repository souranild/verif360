"use client";
// import { fetchQuestions } from '@/lib/data';
import Navigation from "@/components/Navigation";
import Link from "next/link";
import QuestionCard from "@/components/QuestionCard";

import { useEffect, useState } from "react";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then(setQuestions);
  }, []);

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Problems</h1>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search problems..."
                className="px-4 py-2 border border-border rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <select className="px-4 py-2 border border-border rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-primary">
                <option>All</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ul className="divide-y divide-border bg-card border border-border shadow-sm overflow-hidden sm:rounded-md">
          {questions.map((q) => (
            <li key={q.slug} className="p-3">
              <QuestionCard q={q} />
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing 1 to {questions.length} of {questions.length} results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-border rounded-md text-sm hover:bg-secondary text-muted-foreground">
              Previous
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary-hover">
              1
            </button>
            <button className="px-3 py-1 border border-border rounded-md text-sm hover:bg-secondary text-muted-foreground">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
