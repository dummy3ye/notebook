"use client";

import { Search, Command } from "lucide-react";

export default function SearchButton() {
    return (
        <button
            onClick={() =>
                window.dispatchEvent(
                    new KeyboardEvent("keydown", { key: "k", metaKey: true })
                )
            }
            className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl border border-border bg-muted/20 text-muted hover:text-foreground hover:border-muted transition-all group"
        >
            <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-1.5">
                <kbd className="flex h-5 items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted">
                    <Command size={10} />
                </kbd>
                <kbd className="flex h-5 items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted">
                    K
                </kbd>
            </div>
        </button>
    );
}
