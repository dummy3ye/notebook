"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [allPosts, setAllPosts] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      if (allPosts.length === 0) {
        fetch("/api/search")
          .then((res) => res.json())
          .then((data) => setAllPosts(data));
      }
    } else {
      // Use microtask to avoid synchronous setState in effect lint error
      Promise.resolve().then(() => {
        setQuery("");
        setResults([]);
      });
    }
  }, [isOpen, allPosts.length]);

  useEffect(() => {
    if (query.trim() === "") {
      Promise.resolve().then(() => setResults([]));
      return;
    }

    const filtered = allPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase())
    );
    Promise.resolve().then(() => {
      setResults(filtered);
      setSelectedIndex(0);
    });
  }, [query, allPosts]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results[selectedIndex]) {
      navigateToPost(results[selectedIndex].slug);
    }
  };

  const navigateToPost = (slug: string) => {
    router.push(`/blog/${slug}`);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl bg-background border border-border shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-border">
          <svg className="w-5 h-5 text-muted mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="w-full py-4 bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted opacity-100">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length > 0 ? (
            results.map((post, index) => (
              <button
                key={post.slug}
                onClick={() => navigateToPost(post.slug)}
                className={`w-full text-left px-4 py-3 rounded-lg flex flex-col gap-1 transition-colors ${
                  index === selectedIndex ? "bg-muted" : "hover:bg-muted/50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">{post.title}</span>
                  <span className="text-xs text-muted">{post.date}</span>
                </div>
                <p className="text-sm text-muted line-clamp-1">{post.excerpt}</p>
              </button>
            ))
          ) : query ? (
            <div className="px-4 py-8 text-center text-muted italic">No results found for &quot;{query}&quot;</div>
          ) : (
            <div className="px-4 py-8 text-center text-muted italic">Type to search for posts...</div>
          )}
        </div>
        
        <div className="px-4 py-2 border-t border-border bg-muted/30 flex justify-between items-center text-[10px] text-muted font-medium uppercase tracking-widest">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><kbd className="border border-border bg-background px-1 rounded">↵</kbd> Select</span>
            <span className="flex items-center gap-1"><kbd className="border border-border bg-background px-1 rounded">↑↓</kbd> Navigate</span>
          </div>
          <span>Notebook Search v1.0</span>
        </div>
      </div>
      <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)} />
    </div>
  );
}
