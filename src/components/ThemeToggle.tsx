"use client";

import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light'|'dark'|'system'>('system');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('verif360-theme');
      if (stored === 'dark' || stored === 'light') setTheme(stored as 'dark'|'light');
      else setTheme('system');
    } catch (e) {
      setTheme('system');
    }
  }, []);

  useEffect(() => {
    // apply theme
    try {
      const apply = (t: 'light'|'dark'|'system') => {
        if (t === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (t === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          // system: mirror OS preference
          const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) document.documentElement.classList.add('dark');
          else document.documentElement.classList.remove('dark');
        }
      };

      apply(theme);

      // if system, listen for changes
      let mq: MediaQueryList | null = null;
      const mqHandler = (e: MediaQueryListEvent) => {
        if (theme === 'system') {
          if (e.matches) document.documentElement.classList.add('dark');
          else document.documentElement.classList.remove('dark');
        }
      };

      if (theme === 'system' && window.matchMedia) {
        mq = window.matchMedia('(prefers-color-scheme: dark)');
        try {
          mq.addEventListener('change', mqHandler);
        } catch (err) {
          // fallback
          // @ts-ignore
          mq.addListener(mqHandler);
        }
      }

      if (theme === 'dark') localStorage.setItem('verif360-theme', 'dark');
      else if (theme === 'light') localStorage.setItem('verif360-theme', 'light');
      else localStorage.removeItem('verif360-theme');

      return () => {
        if (mq) {
          try { mq.removeEventListener('change', mqHandler); } catch (err) { /* fallback */ }
        }
      };
    } catch (e) {
      // ignore
    }
  }, [theme]);

  function cycle() {
    setTheme((t) => (t === 'system' ? 'dark' : t === 'dark' ? 'light' : 'system'));
  }

  const title = theme === 'dark' ? 'Dark theme' : theme === 'light' ? 'Light theme' : 'Use device theme';

  return (
    <button
      onClick={cycle}
      aria-label={`Theme: ${title}`}
      title={`Theme: ${title}`}
      className="absolute right-0 top-full mt-2 z-40 w-10 h-10 rounded-full flex items-center justify-center shadow bg-white/80 dark:bg-slate-800/65 text-base transition-transform hover:scale-102 opacity-100"
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
          <path d="M21.752 15.002A9 9 0 1 1 12.998 2.25a7 7 0 1 0 8.754 12.752z" />
        </svg>
      ) : theme === 'light' ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-indigo-600">
          <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414M18.364 18.364l-1.414-1.414M7.05 7.05L5.636 5.636" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        // system icon
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600 dark:text-gray-300">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
          <path d="M12 6v6l4 2" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
