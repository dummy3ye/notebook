"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
    slug: string;
    title: string;
    date: string;
    content: string;
}

const commands = [
    {
        id: "theme-dark",
        label: ">theme dark",
        action: () => {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        },
    },
    {
        id: "theme-light",
        label: ">theme light",
        action: () => {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        },
    },
    {
        id: "home",
        label: ">home",
        action: () => {
            window.location.href = "/";
        },
    },
    {
        id: "test",
        label: ">test",
        action: () => {
            window.location.href = "/test";
        },
    },
];

const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
        <span>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <mark
                        key={i}
                        className="bg-foreground text-background rounded-sm px-0.5"
                    >
                        {part}
                    </mark>
                ) : (
                    part
                )
            )}
        </span>
    );
};

export default function Search() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<
        {
            slug: string;
            title: string;
            isCommand?: boolean;
            displayTitle?: React.ReactNode;
            displaySnippet?: React.ReactNode;
        }[]
    >([]);
    const [allPosts, setAllPosts] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isCommandMode, setIsCommandMode] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === "Escape") setIsOpen(false);
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
            Promise.resolve().then(() => {
                setQuery("");
                setIsCommandMode(false);
            });
        }
    }, [isOpen, allPosts.length]);

    useEffect(() => {
        if (query.startsWith(">")) {
            Promise.resolve().then(() => {
                setIsCommandMode(true);
                const filtered = commands.filter((c) =>
                    c.label.includes(query.toLowerCase())
                );
                setResults(
                    filtered.map((c) => ({
                        slug: c.id,
                        title: c.label,
                        isCommand: true,
                    }))
                );
            });
        } else {
            Promise.resolve().then(() => {
                setIsCommandMode(false);
                const q = query.toLowerCase();
                const filtered = allPosts.filter(
                    (post) =>
                        post.title.toLowerCase().includes(q) ||
                        post.content.toLowerCase().includes(q)
                );
                setResults(
                    filtered.map((p) => {
                        let snippet: React.ReactNode = null;
                        const contentLower = p.content.toLowerCase();
                        const queryIndex = contentLower.indexOf(q);

                        if (queryIndex !== -1 && query.length > 0) {
                            const start = Math.max(0, queryIndex - 40);
                            const end = Math.min(
                                p.content.length,
                                queryIndex + query.length + 80
                            );
                            let text = p.content.slice(start, end);
                            if (start > 0) text = "..." + text;
                            if (end < p.content.length) text = text + "...";
                            snippet = highlightText(text, query);
                        }

                        return {
                            ...p,
                            isCommand: false,
                            displayTitle: highlightText(p.title, query),
                            displaySnippet: snippet,
                        };
                    })
                );
            });
        }
        Promise.resolve().then(() => setSelectedIndex(0));
    }, [query, allPosts]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % results.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(
                (prev) => (prev - 1 + results.length) % results.length
            );
        } else if (e.key === "Enter" && results[selectedIndex]) {
            const item = results[selectedIndex];
            if (item.isCommand) {
                const cmd = commands.find((c) => c.id === item.slug);
                cmd?.action();
            } else {
                router.push(`/blog/${item.slug}`);
            }
            setIsOpen(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
        >
            <div
                className="w-full max-w-2xl bg-background border border-border shadow-2xl rounded-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center px-4 border-b border-border">
                    <input
                        ref={inputRef}
                        className="w-full py-4 bg-transparent focus:outline-none text-foreground"
                        placeholder={isCommandMode ? "Command..." : "Search..."}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {results.map((item, index) => (
                        <button
                            key={item.slug}
                            onClick={() => {
                                if (item.isCommand) {
                                    const cmd = commands.find(
                                        (c) => c.id === item.slug
                                    );
                                    cmd?.action();
                                } else {
                                    router.push(`/blog/${item.slug}`);
                                }
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 rounded-lg flex flex-col gap-1 ${
                                index === selectedIndex ? "bg-muted/40" : ""
                            }`}
                        >
                            <span className="font-semibold text-foreground">
                                {item.displayTitle || item.title}
                            </span>
                            {item.displaySnippet && (
                                <span className="text-xs text-muted line-clamp-2">
                                    {item.displaySnippet}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
