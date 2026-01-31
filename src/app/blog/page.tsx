"use client";
// import { fetchBlogs } from '@/lib/data';
import Card from '@/components/Card';
import Link from 'next/link';

import { useEffect, useState } from 'react';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then(setBlogs);
  }, []);

  return (
    <div className="min-h-screen bg-muted">
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-foreground mb-12">Blogs</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`} className="block">
              <Card className="h-full cursor-pointer">
                {blog.featured_image ? (
                  <div className="mb-4 overflow-hidden rounded-md">
                    <img src={blog.featured_image} alt={blog.title} className="w-full h-40 object-cover" />
                  </div>
                ) : null}
                <h2 className="text-xl font-semibold mb-2 text-foreground">{blog.title}</h2>
                <p className="text-sm text-muted-foreground mb-2">By {blog.author} on {new Date(blog.date).toLocaleDateString()}</p>
                <p className="text-muted-foreground mb-4">{blog.excerpt}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags?.map((tag: string) => (
                    <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded border border-primary/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-primary hover:text-primary-hover font-medium">Read More →</span>
              </Card>
            </Link>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}