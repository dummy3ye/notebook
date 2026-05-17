import fs from "fs/promises";
import path from "path";
import fm from "front-matter";
import { Marked } from "marked";
import markedKatex from "marked-katex-extension";
import { notFound } from "next/navigation";
import Link from "next/link";

// Configure marked with KaTeX extension and custom heading renderer using a dedicated instance
const markedInstance = new Marked();

markedInstance.use(markedKatex({
  throwOnError: false,
  nonStandard: true
}));

markedInstance.use({
  renderer: {
    heading({ tokens, depth, raw }) {
      const id = raw
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      
      const content = this.parser.parseInline(tokens);
      return `<h${depth} id="${id}">${content}</h${depth}>`;
    }
  }
});

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
  const htmlContent = await markedInstance.parse(body);

  // Simple Heading extraction for TOC
  const headings: Heading[] = [];
  const lines = body.split("\n");
  lines.forEach((line) => {
    const match = line.match(/^(#{2,3})\s+(.*)/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      headings.push({ text, level, id });
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
        <main className="flex-1 max-w-3xl">
          <header className="mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {attributes.title}
            </h1>
          </header>

          <article 
            className="prose prose-zinc dark:prose-invert max-w-none 
              [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-12 [&>h2]:mb-6
              [&>h3]:text-xl [&>h3]:font-medium [&>h3]:mt-8 [&>h3]:mb-4
              [&>p]:text-lg [&>p]:leading-8 [&>p]:mb-6 [&>p]:text-foreground/90
              [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6
              [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6
              [&_img]:rounded-lg [&_img]:my-8
              [&_.katex-display]:my-8 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden"
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        </main>

        {/* Right Sidebar: Sticky Navigation (TOC) */}
        <aside className="hidden w-64 shrink-0 xl:block">
          <div className="sticky top-20">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">On this page</h4>
            <nav className="flex flex-col gap-3">
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className={`text-sm transition-colors hover:text-foreground ${
                    heading.level === 3 ? "pl-4 text-muted/80" : "font-medium text-muted"
                  }`}
                >
                  {heading.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
