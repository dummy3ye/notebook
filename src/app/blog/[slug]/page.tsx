import fs from "fs/promises";
import path from "path";
import fm from "front-matter";
import { Marked } from "marked";
import markedKatex from "marked-katex-extension";
import { notFound } from "next/navigation";
import Link from "next/link";
import TableOfContents from "@/components/TableOfContents";
import { getHighlighter } from "@/lib/shiki";

interface PostData {
  title: string;
  date: string;
}

interface Heading {
  text: string;
  level: number;
  id: string;
}

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "content");
  const files = await fs.readdir(contentDir);
  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      slug: file.replace(".md", ""),
    }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content", `${slug}.md`);

  let fileContent: string;
  try {
    fileContent = await fs.readFile(filePath, "utf-8");
  } catch {
    notFound();
  }

  const { attributes, body } = fm<PostData>(fileContent);

  // Initialize Highlighter once
  const highlighter = await getHighlighter();
  const markedInstance = new Marked();

  markedInstance.use(markedKatex({
    throwOnError: false,
    nonStandard: true
  }));

  // Shared ID generation helper
  const generateId = (text: string) => text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  markedInstance.use({
    renderer: {
      heading({ tokens, depth, raw }) {
        const text = raw.replace(/[#*`]/g, "").trim();
        const id = generateId(text);
        
        const content = this.parser.parseInline(tokens);
        return `<h${depth} id="${id}">${content}</h${depth}>`;
      },
      code({ text, lang }) {
        const html = highlighter.codeToHtml(text, {
          lang: lang || "text",
          themes: {
            light: "github-light",
            dark: "github-dark"
          }
        });
        return `<div class="not-prose">${html}</div>`;
      }
    }
  });

  const htmlContent = await markedInstance.parse(body);

  // Extract headings for TOC (h2-h4)
  const headings: Heading[] = [];
  const lines = body.split("\n");
  lines.forEach((line) => {
    const trimmed = line.trim();
    const match = trimmed.match(/^(#{2,4})\s+(.*)/);
    if (match) {
      const text = match[2].replace(/[#*`]/g, "").trim();
      const id = generateId(text);
      headings.push({ text, level: match[1].length, id });
    }
  });

  return (
    <div className="flex w-full min-h-screen justify-center px-6 py-20 lg:px-12">
      <div className="flex w-full max-w-[1400px] gap-12">
        {/* Left Sidebar: Metadata */}
        <aside className="hidden w-48 shrink-0 lg:block">
          <div className="sticky top-20 flex flex-col gap-4">
            <Link href="/" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
              ← Back
            </Link>
            <div className="mt-8 flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted">Published</span>
              <time className="text-sm font-medium text-foreground">{attributes.date}</time>
            </div>
          </div>
        </aside>

        {/* Main Content Column */}
        <main className="flex-1 max-w-3xl overflow-hidden">
          <header className="mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {attributes.title}
            </h1>
          </header>

          <article 
            className="prose max-w-none 
              text-foreground
              prose-headings:text-foreground
              [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:mt-16 [&>h2]:mb-8 [&>h2]:tracking-tight
              [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:mt-12 [&>h3]:mb-6 [&>h3]:tracking-tight
              [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:mt-10 [&>h4]:mb-4
              [&>p]:text-lg [&>p]:leading-8 [&>p]:mb-8 [&>p]:text-muted
              [&>ul]:text-muted [&>ol]:text-muted
              [&_img]:rounded-xl [&_img]:my-12
              [&_.katex-display]:my-10 [&_.katex-display]:overflow-x-auto [&_.katex-display]:py-2"
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        </main>

        {/* Right Sidebar: Sticky Navigation (TOC) */}
        <aside className="hidden w-64 shrink-0 xl:block">
          <div className="sticky top-20">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">On this page</h4>
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>
    </div>
  );
}
