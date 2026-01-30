"use client";

import Link from "next/link";
import React from "react";

interface QuestionCardProps {
  q: any;
}

export default function QuestionCard({ q }: QuestionCardProps) {
  const snippet =
    q.description?.length > 160
      ? `${q.description.slice(0, 160)}...`
      : q.description;

  return (
    <article className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            <Link
              href={`/questions/${q.slug}`}
              className="hover:underline text-primary"
            >
              {q.title}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground mb-3">{snippet}</p>
          <div className="flex flex-wrap gap-2">
            {q.tags?.slice(0, 6).map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right ml-4 flex-shrink-0">
          <div className="mb-2">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                q.difficulty === "Easy"
                  ? "bg-success/10 text-success border border-success/20"
                  : q.difficulty === "Medium"
                    ? "bg-warning/10 text-warning border border-warning/20"
                    : "bg-error/10 text-error border border-error/20"
              }`}
            >
              {q.difficulty}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {(q.acceptance_rate * 100).toFixed(1)}% accepted
          </div>
        </div>
      </div>
    </article>
  );
}
