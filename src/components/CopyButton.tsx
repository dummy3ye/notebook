"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={copy}
            className="absolute top-4 right-4 p-2 rounded-lg border border-border bg-background/50 backdrop-blur-sm text-muted opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-background transition-all z-10 shadow-sm"
            aria-label="Copy code"
        >
            {copied ? (
                <Check className="w-4 h-4 text-green-500" />
            ) : (
                <Copy className="w-4 h-4" />
            )}
        </button>
    );
}
