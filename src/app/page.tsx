'use client';

import { useState, useEffect } from 'react';
// import { fetchBlogs, fetchQuestions, fetchCourses } from '@/lib/data';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [questions, setQuestions] = useState([]);
  // const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then(setBlogs);
    fetch('/api/questions')
      .then((res) => res.json())
      .then(setQuestions);
    // fetchCourses().then(setCourses);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-r from-primary via-primary-hover to-accent py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl font-bold text-white mb-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Master Digital Verification
          </motion.h1>
          <motion.p 
            className="text-xl text-white/90 mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Learn, practice, and excel in digital verification with LeetCode-style problems, courses, and comprehensive blogs.
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button size="lg">Get Started</Button>
          </motion.div>
        </div>
      </section>

      {/* Explore Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Explore</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Blogs */}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Latest Blogs</h3>
              {blogs.slice(0, 3).map((blog) => (
                <motion.div
                  key={blog.slug}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * blogs.indexOf(blog) }}
                >
                  <Link href={`/blog/${blog.slug}`} className="block">
                    <Card className="mb-4 cursor-pointer">
                      <h4 className="font-semibold text-foreground">{blog.title}</h4>
                      <p className="text-sm text-muted-foreground">By {blog.author}</p>
                      <p className="text-sm text-muted-foreground">{blog.excerpt}</p>
                      <span className="text-primary hover:text-primary-hover text-sm font-medium">Read More →</span>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
            {/* Questions */}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Popular Problems</h3>
              {questions.slice(0, 3).map((q) => (
                <motion.div
                  key={q.slug}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * questions.indexOf(q) }}
                >
                  <Link href={`/questions/${q.slug}`} className="block">
                    <Card className="mb-4 cursor-pointer">
                      <h4 className="font-semibold text-foreground">{q.title}</h4>
                      <p className="text-sm text-muted-foreground">{q.difficulty} • {q.tags.join(', ')}</p>
                      <span className="text-primary hover:text-primary-hover text-sm font-medium">Solve →</span>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
            {/* Useful Info */}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Useful Information</h3>
              <Card className="mb-4">
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  <li><a href="https://systemverilog.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SystemVerilog Official Docs</a></li>
                  <li><a href="https://verificationacademy.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Verification Academy</a></li>
                  <li><a href="https://github.com/chipsalliance/sv-tests" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SV-Tests GitHub</a></li>
                  {/* Add more useful links here */}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-success to-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Platform Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-white">1000+</div>
              <div className="text-white/80">Problems</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">50+</div>
              <div className="text-white/80">Courses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">500+</div>
              <div className="text-white/80">Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">200+</div>
              <div className="text-white/80">Blog Posts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border text-foreground py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 Verif360. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
