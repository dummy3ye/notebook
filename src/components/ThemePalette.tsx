"use client";

import { useEffect, useState, useRef } from "react";

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
    const inputRef = useRef<HTMLInputElement>(null);

    // Initial fetch of dynamic themes
    useEffect(() => {
        fetch("/api/themes")
            .then((res) => res.json())
            .then((data) => {
                setThemes(data);

                // Initialize selection based on localStorage
                const savedTheme = localStorage.getItem("theme");
                const themeIndex = data.findIndex(
                    (t: Theme) => t.id === (savedTheme || "snow")
                );
                const actualIndex = themeIndex === -1 ? 0 : themeIndex;
                setSelectedIndex(actualIndex);
                document.documentElement.className =
                    data[actualIndex]?.class || "snow";
                if (!savedTheme) localStorage.setItem("theme", "snow");
            });
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "j") {
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
        } else {
            Promise.resolve().then(() => setQuery(""));
        }
    }, [isOpen]);

    const filteredThemes = themes.filter((t) =>
        t.label.toLowerCase().includes(query.toLowerCase())
    );

    // Sync selectedIndex when filtering changes
    useEffect(() => {
        Promise.resolve().then(() => setSelectedIndex(0));
    }, [query]);

    const setTheme = (theme: Theme) => {
        localStorage.setItem("theme", theme.id);
        document.documentElement.className = theme.class;
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % filteredThemes.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(
                (prev) =>
                    (prev - 1 + filteredThemes.length) % filteredThemes.length
            );
        } else if (e.key === "Enter" && filteredThemes[selectedIndex]) {
            setTheme(filteredThemes[selectedIndex]);
        }
    };

    return (
        <>
            {/* Trigger Icon */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-20 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Select theme"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M12 2v20M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" />
                </svg>
            </button>

            {/* Overlay Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="w-full max-w-md bg-background border border-border shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center px-4 border-b border-border bg-muted/10">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="h-4 w-4 text-muted"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                            <input
                                ref={inputRef}
                                className="w-full py-4 px-3 bg-transparent focus:outline-none text-foreground text-sm"
                                placeholder="Search themes..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="flex items-center gap-1">
                                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    <span className="text-xs">↑↓</span>
                                </kbd>
                                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    <span className="text-xs">↵</span>
                                </kbd>
                            </div>
                        </div>
                        <div className="max-h-[50vh] overflow-y-auto p-2">
                            {filteredThemes.length > 0 ? (
                                filteredThemes.map((theme, index) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => setTheme(theme)}
                                        onMouseEnter={() =>
                                            setSelectedIndex(index)
                                        }
                                        className={`w-full text-left px-4 py-3 rounded-lg flex justify-between items-center transition-colors ${
                                            index === selectedIndex
                                                ? "bg-muted/40"
                                                : "hover:bg-muted/20"
                                        }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-foreground text-sm">
                                                {theme.label}
                                            </span>
                                            <span className="text-[10px] uppercase tracking-wider text-muted font-mono">
                                                {theme.id}
                                            </span>
                                        </div>
                                        {index === selectedIndex && (
                                            <div className="h-2 w-2 rounded-full bg-foreground animate-pulse" />
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-8 text-center text-muted text-sm italic">
                                    No themes matching &quot;{query}&quot;
                                </div>
                            )}
                        </div>
                        <div className="px-4 py-2 border-t border-border bg-muted/5 flex justify-between items-center">
                            <span className="text-[10px] text-muted font-medium uppercase tracking-widest">
                                {filteredThemes.length} Themes Available
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
