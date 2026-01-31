"use client";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import BlogContent from "@/components/BlogContent";
import { useParams, useRouter } from "next/navigation";

export default function BlogPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.slug) return;
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((blogs) => {
        const found = blogs.find((b) => b.slug === params.slug);
        if (!found) {
          router.replace("/blog");
        } else {
          setBlog(found);
        }
        setLoading(false);
      });
  }, [params, router]);

  if (loading)
    return (
      <div className="min-h-screen bg-muted">
        <Navigation />
        <div className="py-16 text-center">Loading...</div>
      </div>
    );
  if (!blog) return null;

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article>
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4 text-foreground">
                {blog.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-2">
                By {blog.author}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(blog.date).toLocaleDateString()}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary text-xs px-2 py-1 rounded border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>
            <BlogContent
              source={blog.content}
              className="prose max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground"
            />
          </article>
        </div>
      </div>
    </div>
  );
}
