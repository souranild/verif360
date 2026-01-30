"use client";

import React, { useState } from "react";
import Button from "@/components/Button/Button";

interface SolutionProps {
  solution: { language: string; code: string };
}

export default function QuestionSolutionClient({ solution }: SolutionProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(solution.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("copy failed", e);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Solution</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setOpen((s) => !s)}
          >
            {open ? "Hide" : "Show"}
          </Button>
          <Button variant="primary" size="sm" onClick={copy}>
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      {open && (
        <div className="bg-secondary p-4 rounded border border-border">
          <div className="mb-2 text-sm text-muted-foreground">
            Language:{" "}
            <strong className="text-foreground">{solution.language}</strong>
          </div>
          <pre className="bg-gray-900 text-white p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap">
            <code>{solution.code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
