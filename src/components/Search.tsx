"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search as SearchIcon,
    FileText,
    Terminal,
    Command,
} from "lucide-react";

interface SearchResult {
    slug: string;
    title: string;
    date: string;
    content: string;
}

const commands = [
    {
        id: "home",
        label: ">home",
        description: "Go to home page",
        action: (router: AppRouterInstance) => router.push("/"),
    },
    {
        id: "theme",
        label: ">theme",
        description: "Open theme palette",
        action: () => {
            window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "j", metaKey: true })
            );
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
    const [allPosts, setAllPosts] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const isCommandMode = query.startsWith(">");

    const results = useMemo(() => {
        if (isCommandMode) {
            const q = query.slice(1).toLowerCase();
            const filtered = commands.filter(
                (c) =>
                    c.label.toLowerCase().includes(query.toLowerCase()) ||
                    c.description.toLowerCase().includes(q)
            );
            return filtered.map((c) => ({
                slug: c.id,
                title: c.label,
                description: c.description,
                isCommand: true,
                displayTitle: null,
                displaySnippet: null,
            }));
        } else {
            const q = query.toLowerCase();
            const filtered = allPosts.filter(
                (post) =>
                    post.title.toLowerCase().includes(q) ||
                    post.content.toLowerCase().includes(q)
            );
            return filtered.map((p) => {
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
                    slug: p.slug,
                    title: p.title,
                    isCommand: false,
                    displayTitle: highlightText(p.title, query),
                    displaySnippet: snippet,
                    description: null,
                };
            });
        }
    }, [query, allPosts, isCommandMode]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen((prev) => {
                    const next = !prev;
                    if (!next) setQuery("");
                    return next;
                });
            }
            if (e.key === "Escape") {
                setIsOpen(false);
                setQuery("");
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            if (allPosts.length === 0) {
                fetch("/api/search")
                    .then((res) => res.json())
                    .then((data) => setAllPosts(data));
            }
        }
    }, [isOpen, allPosts.length]);

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setSelectedIndex(0);
    };

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
                cmd?.action(router);
            } else {
                router.push(`/blog/${item.slug}`);
            }
            setIsOpen(false);
            setQuery("");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-background/20 backdrop-blur-md"
                    onClick={() => {
                        setIsOpen(false);
                        setQuery("");
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: -20 }}
                        transition={{
                            type: "spring",
                            damping: 20,
                            stiffness: 300,
                        }}
                        className="w-full max-w-2xl bg-background border border-border shadow-2xl rounded-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center px-4 border-b border-border bg-muted/5">
                            <SearchIcon className="h-5 w-5 text-muted ml-2" />
                            <input
                                ref={inputRef}
                                className="w-full py-5 px-4 bg-transparent focus:outline-none text-foreground text-lg"
                                placeholder={
                                    isCommandMode
                                        ? "Type a command..."
                                        : "Search across the notebook..."
                                }
                                value={query}
                                onChange={handleQueryChange}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="flex items-center gap-2 pr-2">
                                <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-border bg-muted/20 px-2 font-mono text-[10px] font-medium text-muted">
                                    <Command size={10} />K
                                </kbd>
                            </div>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-3 custom-scrollbar">
                            {results.length > 0 ? (
                                <div className="grid gap-1">
                                    {results.map((item, index) => (
                                        <button
                                            key={item.slug}
                                            onClick={() => {
                                                if (item.isCommand) {
                                                    const cmd = commands.find(
                                                        (c) =>
                                                            c.id === item.slug
                                                    );
                                                    cmd?.action(router);
                                                } else {
                                                    router.push(
                                                        `/blog/${item.slug}`
                                                    );
                                                }
                                                setIsOpen(false);
                                                setQuery("");
                                            }}
                                            onMouseEnter={() =>
                                                setSelectedIndex(index)
                                            }
                                            className={`w-full text-left px-4 py-4 rounded-xl flex items-start gap-4 transition-all ${
                                                index === selectedIndex
                                                    ? "bg-foreground text-background"
                                                    : "hover:bg-muted/30 text-foreground"
                                            }`}
                                        >
                                            <div
                                                className={`mt-1 p-2 rounded-lg ${
                                                    index === selectedIndex
                                                        ? "bg-background/20"
                                                        : "bg-muted/10"
                                                }`}
                                            >
                                                {item.isCommand ? (
                                                    <Terminal size={18} />
                                                ) : (
                                                    <FileText size={18} />
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1 overflow-hidden">
                                                <span className="font-semibold text-base truncate">
                                                    {item.displayTitle ||
                                                        item.title}
                                                </span>
                                                {(item.displaySnippet ||
                                                    item.description) && (
                                                    <span
                                                        className={`text-xs line-clamp-2 leading-relaxed ${
                                                            index ===
                                                            selectedIndex
                                                                ? "opacity-80"
                                                                : "text-muted"
                                                        }`}
                                                    >
                                                        {item.displaySnippet ||
                                                            item.description}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center">
                                    <p className="text-muted text-sm italic">
                                        No results found for &quot;{query}&quot;
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="px-5 py-3 border-t border-border bg-muted/5 flex justify-between items-center">
                            <span className="text-[10px] text-muted font-bold uppercase tracking-widest">
                                {results.length} Results
                            </span>
                            <div className="flex gap-4 text-[10px] text-muted font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-1">
                                    <span className="border border-border rounded px-1">
                                        ↑↓
                                    </span>{" "}
                                    Navigate
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="border border-border rounded px-1">
                                        ↵
                                    </span>{" "}
                                    Open
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
