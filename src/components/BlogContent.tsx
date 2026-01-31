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
    const converter = new Converter();
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

  return (
    <article
      className={`prose max-w-none ${className || ""}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
