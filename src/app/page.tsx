import fs from "fs/promises";
import path from "path";
import fm from "front-matter";
import HomeView from "@/components/HomeView";

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

    return <HomeView posts={posts} />;
}
