"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Converter } from "showdown";

type Props = {
  source: string;
  className?: string;
};

export default function BlogContent({ source, className }: Props) {
  const [domPurify, setDomPurify] = useState<any | null>(null);

  // Heuristic: treat as HTML if it includes '<h' or '<p' or '<div'
  const isHtml = useMemo(() => /<h|<p|<div/i.test(source), [source]);

  // Convert Markdown to HTML only if not already HTML
  const convertedHtml = useMemo(() => {
    if (isHtml) return source;
    const converter = new Converter({
      tables: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tasklists: true,
      ghCodeBlocks: true,
    });
    return converter.makeHtml(source);
  }, [source, isHtml]);

  // Dynamically load DOMPurify on the client to avoid SSR issues
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (typeof window === "undefined") return;
      try {
        const mod = await import("dompurify");
        const dp = (mod && (mod.default || mod)) as any;
        if (mounted) setDomPurify(dp);
      } catch {
        // If import fails, we'll fall back to un-sanitized converted HTML
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Use useMemo to compute the sanitized HTML string
  const sanitizedHtml = useMemo(() => {
    if (domPurify && typeof domPurify.sanitize === "function") {
      return domPurify.sanitize(convertedHtml);
    }
    return convertedHtml;
  }, [convertedHtml, domPurify]);

  // Run syntax highlighting after sanitized HTML updates
  useEffect(() => {
    let mounted = true;
    if (typeof window === "undefined") return;
    (async () => {
      try {
        // import highlight.js and a style
        const hl = await import("highlight.js");
        await import("highlight.js/styles/github-dark.css");
        if (mounted && hl && typeof hl.highlightAll === "function") {
          hl.highlightAll();
        }
      } catch (err) {
        // ignore highlight errors
        // console.warn('highlight failed', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [sanitizedHtml]);

  return (
    <article
      className={`prose max-w-none ${className || ""}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
