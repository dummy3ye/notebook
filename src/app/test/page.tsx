"use client";

import { useState, useEffect } from "react";
import { Marked } from "marked";
import markedKatex from "marked-katex-extension";
import { createHighlighter, type Highlighter } from "shiki";

export default function TestPage() {
  const [content, setContent] = useState("# Hello World\n\nInline math: $E=mc^2$\n\n$$ a^2+b^2=c^2 $$");
  const [html, setHtml] = useState("");
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);

  useEffect(() => {
    createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: ["javascript", "typescript", "python", "markdown", "latex", "css", "html", "bash", "json", "powershell"]
    }).then(setHighlighter);
  }, []);

  useEffect(() => {
    if (!highlighter) return;

    const markedInstance = new Marked();
    markedInstance.use(markedKatex({ throwOnError: false, nonStandard: true }));
    markedInstance.use({
      renderer: {
        code({ text, lang }) {
          return `<div class="not-prose">${highlighter.codeToHtml(text, {
            lang: lang || "text",
            themes: { light: "github-light", dark: "github-dark" }
          })}</div>`;
        }
      }
    });

    setHtml(markedInstance.parse(content) as string);
  }, [content, highlighter]);

  return (
    <div className="flex h-screen w-full flex-col">
      <header className="border-b border-border p-4 text-sm font-semibold uppercase tracking-widest text-muted">
        Live Markdown/Math Preview
      </header>
      <div className="flex flex-1 overflow-hidden">
        <textarea
          className="w-1/2 resize-none border-r border-border bg-background p-6 text-foreground focus:outline-none font-mono"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <article 
          className="prose max-w-none w-1/2 overflow-y-auto p-8 text-foreground prose-headings:text-foreground prose-p:text-muted"
          dangerouslySetInnerHTML={{ __html: html }} 
        />
      </div>
    </div>
  );
}
