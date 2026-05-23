"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Search, Check, Command } from "lucide-react";

interface Theme {
    id: string;
    label: string;
    class: string;
}

export default function ThemePalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [themes, setThemes] = useState<Theme[]>([]);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [activeThemeId, setActiveThemeId] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Initial fetch of dynamic themes
    useEffect(() => {
        fetch("/api/themes")
            .then((res) => res.json())
            .then((data) => {
                setThemes(data);

                const savedTheme = localStorage.getItem("theme") || "snow";
                setActiveThemeId(savedTheme);
                document.documentElement.className = savedTheme;
            });
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "j") {
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
                // Restore active theme on escape
                document.documentElement.className = activeThemeId;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeThemeId]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const filteredThemes = themes.filter((t) =>
        t.label.toLowerCase().includes(query.toLowerCase())
    );

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setSelectedIndex(0);
    };

    const confirmTheme = (theme: Theme) => {
        localStorage.setItem("theme", theme.id);
        setActiveThemeId(theme.id);
        document.documentElement.className = theme.class;
        setIsOpen(false);
        setQuery("");
    };

    const previewTheme = (theme: Theme) => {
        document.documentElement.className = theme.class;
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            const nextIndex = (selectedIndex + 1) % filteredThemes.length;
            setSelectedIndex(nextIndex);
            previewTheme(filteredThemes[nextIndex]);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const prevIndex =
                (selectedIndex - 1 + filteredThemes.length) %
                filteredThemes.length;
            setSelectedIndex(prevIndex);
            previewTheme(filteredThemes[prevIndex]);
        } else if (e.key === "Enter" && filteredThemes[selectedIndex]) {
            confirmTheme(filteredThemes[selectedIndex]);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
                aria-label="Select theme"
            >
                <Palette className="h-5 w-5 transition-transform group-hover:rotate-12" />
            </button>

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
                            document.documentElement.className = activeThemeId;
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
                            className="w-full max-w-lg bg-background border border-border shadow-2xl rounded-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center px-4 border-b border-border bg-muted/5">
                                <Search className="h-4 w-4 text-muted" />
                                <input
                                    ref={inputRef}
                                    className="w-full py-5 px-4 bg-transparent focus:outline-none text-foreground text-base"
                                    placeholder="Search themes (midnight, rosepine, snow...)"
                                    value={query}
                                    onChange={handleQueryChange}
                                    onKeyDown={handleKeyDown}
                                />
                                <div className="flex items-center gap-2">
                                    <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-border bg-muted/20 px-2 font-mono text-[10px] font-medium text-muted">
                                        <Command size={10} />J
                                    </kbd>
                                </div>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto p-3 custom-scrollbar">
                                {filteredThemes.length > 0 ? (
                                    <div className="grid gap-1">
                                        {filteredThemes.map((theme, index) => (
                                            <button
                                                key={theme.id}
                                                onClick={() =>
                                                    confirmTheme(theme)
                                                }
                                                onMouseEnter={() => {
                                                    setSelectedIndex(index);
                                                    previewTheme(theme);
                                                }}
                                                className={`w-full text-left px-4 py-3.5 rounded-xl flex justify-between items-center transition-all ${
                                                    index === selectedIndex
                                                        ? "bg-foreground text-background"
                                                        : "hover:bg-muted/30 text-foreground"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-2 h-2 rounded-full ${
                                                            index ===
                                                            selectedIndex
                                                                ? "bg-background"
                                                                : "bg-muted"
                                                        }`}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">
                                                            {theme.label}
                                                        </span>
                                                        <span
                                                            className={`text-[10px] uppercase tracking-tighter font-mono ${
                                                                index ===
                                                                selectedIndex
                                                                    ? "opacity-70"
                                                                    : "text-muted"
                                                            }`}
                                                        >
                                                            {theme.id}
                                                        </span>
                                                    </div>
                                                </div>
                                                {theme.id === activeThemeId && (
                                                    <Check
                                                        size={14}
                                                        className={
                                                            index ===
                                                            selectedIndex
                                                                ? "text-background"
                                                                : "text-muted"
                                                        }
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <p className="text-muted text-sm italic">
                                            No themes found for &quot;{query}
                                            &quot;
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="px-5 py-3 border-t border-border bg-muted/5 flex justify-between items-center">
                                <span className="text-[10px] text-muted font-semibold uppercase tracking-widest">
                                    {filteredThemes.length} Themes Available
                                </span>
                                <div className="flex gap-4 text-[10px] text-muted font-medium uppercase tracking-widest">
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
                                        Select
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
