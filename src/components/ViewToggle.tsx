"use client";

import { LayoutGrid, Network } from "lucide-react";

interface ViewToggleProps {
    view: "list" | "chaos";
    onViewChange: (view: "list" | "chaos") => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
    return (
        <div className="flex items-center p-1 bg-secondary rounded-lg border border-border">
            <button
                onClick={() => onViewChange("list")}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    view === "list"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted hover:text-foreground"
                }`}
                title="List View"
            >
                <LayoutGrid size={16} />
                <span>List</span>
            </button>
            <button
                onClick={() => onViewChange("chaos")}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    view === "chaos"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted hover:text-foreground"
                }`}
                title="Chaos View"
            >
                <Network size={16} />
                <span>Chaos</span>
            </button>
        </div>
    );
}
