"use client";

import Link from "next/link";
import React from "react";

interface QuestionCardProps {
  q: any;
  index?: number;
}

export default function QuestionCard({ q }: QuestionCardProps) {
  const snippet =
    q.description?.length > 120
      ? `${q.description.slice(0, 120)}...`
      : q.description;
  const idMatch = q.id ? q.id.match(/question-(\d+)/) : null;
  const num = idMatch ? idMatch[1] : null;
  const numLabel = num ? `Q ${String(num).padStart(3, "0")}` : (typeof (q.index) === 'number' ? `Q ${String(q.index).padStart(3, "0")}` : "");
  const diff = (q.difficulty || "").toString().toLowerCase();

  const diffClasses =
    diff === "easy"
      ? "bg-success/10 text-success border border-success/20"
      : diff === "medium"
        ? "bg-warning/10 text-warning border border-warning/20"
        : "bg-error/10 text-error border border-error/20";

  // safe values
  const difficultyLabel = diff ? (diff.charAt(0).toUpperCase() + diff.slice(1)) : 'Unknown';
  const acceptanceLabel = typeof q.acceptance_rate === 'number' ? `${(q.acceptance_rate * 100).toFixed(1)}% accepted` : '—';

  return (
    <article className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-4 items-center p-3 hover:bg-card-hover transition-colors">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center text-xs font-semibold text-foreground flex-shrink-0">
          {numLabel}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">
            <Link href={`/questions/${q.slug}`} className="hover:underline text-primary truncate block">
              {q.title}
            </Link>
          </h3>
          <p className="text-xs text-muted-foreground truncate mt-1">{snippet}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {q.tags?.slice(0, 4).map((tag: string) => (
              <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                {tag}
              </span>
            ))}
          </div>
          {q.companies?.length ? (
            <div className="flex items-center gap-2 mt-2">
              {q.companies.slice(0, 3).map((c: any) => (
                <img key={c.name} src={c.logo} alt={c.name} title={c.name} className="w-5 h-5 rounded-sm object-cover border border-border" />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 md:items-end">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${diffClasses}`}>
          {difficultyLabel}
        </span>
        <div className="text-xs text-muted-foreground">
          {acceptanceLabel}
        </div>
        <Link href={`/questions/${q.slug}`} className="mt-2 text-sm font-medium text-primary hover:text-primary-hover">
          Solve →
        </Link>
      </div>
    </article>
  );
}
