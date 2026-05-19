"use client";

import { useEffect, useState } from "react";

const themes = [
    { id: "light", label: "Snowwhite", class: "" },
    { id: "dark", label: "Pure Black", class: "dark" },
    { id: "catppuccin", label: "Catppuccin", class: "catppuccin" },
];

export default function ThemePalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Toggle with a different shortcut or just use the icon
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const setTheme = (theme: (typeof themes)[0]) => {
        localStorage.setItem("theme", theme.id);
        window.location.reload(); // Simplest way to apply class and reset state
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const theme = themes.find((t) => t.id === savedTheme) || themes[0];
        document.documentElement.className = theme.class;
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) => (prev + 1) % themes.length);
        } else if (e.key === "ArrowUp") {
            setSelectedIndex(
                (prev) => (prev - 1 + themes.length) % themes.length
            );
        } else if (e.key === "Enter") {
            setTheme(themes[selectedIndex]);
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
                        className="w-full max-w-sm bg-background border border-border shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={handleKeyDown}
                    >
                        <div className="px-4 py-3 border-b border-border text-xs font-semibold uppercase tracking-widest text-muted">
                            Select Theme
                        </div>
                        <div className="p-2">
                            {themes.map((theme, index) => (
                                <button
                                    key={theme.id}
                                    onClick={() => setTheme(theme)}
                                    className={`w-full text-left px-4 py-3 rounded-lg flex justify-between items-center transition-colors ${
                                        index === selectedIndex
                                            ? "bg-muted/40"
                                            : "hover:bg-muted/20"
                                    }`}
                                >
                                    <span className="font-semibold text-foreground">
                                        {theme.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
