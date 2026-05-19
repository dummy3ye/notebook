import fs from "fs/promises";
import path from "path";
import fm from "front-matter";
import Link from "next/link";
import SearchButton from "@/components/SearchButton";

interface PostData {
    title: string;
    date: string;
    draft?: boolean;
}

interface PostEntry {
    slug: string;
    title: string;
    date: string;
    draft?: boolean;
}

async function getPosts(): Promise<PostEntry[]> {
    const contentDir = path.join(process.cwd(), "content");
    const files = await fs.readdir(contentDir);

    const posts = await Promise.all(
        files
            .filter((file) => file.endsWith(".md"))
            .map(async (file) => {
                const filePath = path.join(contentDir, file);
                const fileContent = await fs.readFile(filePath, "utf-8");
                const { attributes } = fm<PostData>(fileContent);
                return {
                    slug: file.replace(".md", ""),
                    title: attributes.title,
                    date: attributes.date,
                    draft: attributes.draft || false,
                };
            })
    );

    // Sort by date descending and filter out drafts
    return posts
        .filter((post) => !post.draft)
        .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
}

export default async function Home() {
    const posts = await getPosts();

    return (
        <div className="flex flex-col flex-1 items-center px-6 py-24 sm:px-12">
            <main className="w-full max-w-2xl">
                <header className="mb-20">
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Notebook.
                        </h1>
                        <SearchButton />
                    </div>
                    <p className="mt-4 text-lg text-muted max-w-lg">
                        So this is where I write about my thoughts, theories,
                        discoveries, basically everything that I do and love
                        about science.
                    </p>
                </header>

                <section className="flex flex-col gap-12">
                    {posts.map((post) => (
                        <article
                            key={post.slug}
                            className="group relative flex flex-col items-start"
                        >
                            <time className="text-sm text-muted mb-2">
                                {post.date}
                            </time>
                            <h2 className="text-xl font-semibold tracking-tight text-foreground group-hover:text-muted transition-colors">
                                <Link href={`/blog/${post.slug}`}>
                                    <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                                    <span className="relative z-10">
                                        {post.title}
                                    </span>
                                </Link>
                            </h2>
                        </article>
                    ))}
                </section>

                {posts.length === 0 && (
                    <p className="text-muted italic">
                        No posts found in the content directory.
                    </p>
                )}
            </main>
        </div>
    );
}
