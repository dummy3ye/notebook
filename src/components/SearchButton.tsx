"use client";

export default function SearchButton() {
    return (
        <button
            onClick={() =>
                window.dispatchEvent(
                    new KeyboardEvent("keydown", { key: "k", metaKey: true })
                )
            }
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/30 text-muted hover:text-foreground hover:border-muted transition-all group"
        >
            <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
            <span className="text-xs font-medium uppercase tracking-widest">
                Ctrl +
            </span>
            <kbd className="text-[10px] font-mono opacity-100 group-hover:opacity-100 transition-opacity">
                K
            </kbd>
        </button>
    );
}
