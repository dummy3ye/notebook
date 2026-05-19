import { createHighlighter, type Highlighter } from "shiki";

// Global cache for the highlighter instance
let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter() {
    if (!highlighterPromise) {
        highlighterPromise = createHighlighter({
            themes: ["github-light", "github-dark"],
            langs: [
                "javascript",
                "typescript",
                "python",
                "markdown",
                "latex",
                "css",
                "html",
                "bash",
                "json",
                "powershell",
            ],
        });
    }
    return highlighterPromise;
}
