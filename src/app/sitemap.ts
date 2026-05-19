import { MetadataRoute } from "next";
import fs from "fs/promises";
import path from "path";
import fm from "front-matter";

interface PostData {
    date: string;
    draft?: boolean;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://tamakisuoh.vercel.app"; // Actual domain
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
                    date: attributes.date,
                    draft: attributes.draft || false,
                };
            })
    );

    const blogEntries = posts
        .filter((post) => !post.draft)
        .map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.date),
        }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
        },
        ...blogEntries,
    ];
}
