"use client";

import Link from "next/link";
import React from "react";

interface QuestionCardProps {
  q: any;
}

export default function QuestionCard({ q }: QuestionCardProps) {
  const snippet =
    q.description?.length > 120
      ? `${q.description.slice(0, 120)}...`
      : q.description;
  const idMatch = q.id ? q.id.match(/question-(\d+)/) : null;
  const num = idMatch ? idMatch[1] : null;
  const numLabel = num ? `Q ${String(num).padStart(3, "0")}` : "";
  const diff = (q.difficulty || "").toString().toLowerCase();

  const diffClasses =
    diff === "easy"
      ? "bg-success/10 text-success border border-success/20"
      : diff === "medium"
        ? "bg-warning/10 text-warning border border-warning/20"
        : "bg-error/10 text-error border border-error/20";

  return (
    <article className="flex items-center justify-between gap-4 p-4 hover:bg-card-hover transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center text-sm font-semibold text-foreground">
          {numLabel}
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground mb-1">
            <Link
              href={`/questions/${q.slug}`}
              className="hover:underline text-primary"
            >
              {q.title}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground">{snippet}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {q.tags?.slice(0, 6).map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${diffClasses}`}
        >
          {diff.charAt(0).toUpperCase() + diff.slice(1)}
        </span>
        <div className="text-sm text-muted-foreground">
          {(q.acceptance_rate * 100).toFixed(1)}% accepted
        </div>
        <Link
          href={`/questions/${q.slug}`}
          className="mt-2 text-sm font-medium text-primary hover:text-primary-hover"
        >
          Solve →
        </Link>
      </div>
    </article>
  );
}
