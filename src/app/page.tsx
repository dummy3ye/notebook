import fs from "fs/promises";
import path from "path";
import fm from "front-matter";
import SearchButton from "@/components/SearchButton";
import ChaosGraphWrapper from "@/components/ChaosGraphWrapper";

interface PostData {
    title: string;
    date: string;
    draft?: boolean;
    tags?: string[];
}

interface PostEntry {
    slug: string;
    title: string;
    date: string;
    draft?: boolean;
    tags: string[];
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
                    tags: attributes.tags || [],
                };
            })
    );

    return posts
        .filter((post) => !post.draft)
        .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
}

export default async function Home() {
    const posts = await getPosts();

    return (
        <div className="flex flex-col min-h-screen">
            <header className="px-6 py-12 sm:px-12 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Notebook.
                        </h1>
                        <p className="text-sm text-muted">
                            Chaos View: Exploring the connections between
                            thoughts.
                        </p>
                    </div>
                    <SearchButton />
                </div>
            </header>

            <main className="flex-1 relative overflow-hidden bg-background">
                {posts.length > 0 ? (
                    <ChaosGraphWrapper posts={posts} />
                ) : (
                    <div className="flex items-center justify-center h-full p-24">
                        <p className="text-muted italic">
                            No posts found in the content directory.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
