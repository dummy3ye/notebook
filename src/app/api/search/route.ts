import fs from "fs/promises";
import path from "path";
import fm from "front-matter";
import { NextResponse } from "next/server";

interface PostData {
    title: string;
    date: string;
}

export async function GET() {
    const contentDir = path.join(process.cwd(), "content");
    const files = await fs.readdir(contentDir);

    const posts = await Promise.all(
        files
            .filter((file) => file.endsWith(".md"))
            .map(async (file) => {
                const filePath = path.join(contentDir, file);
                const fileContent = await fs.readFile(filePath, "utf-8");
                const { attributes, body } = fm<PostData>(fileContent);

                // Strip markdown for search indexing
                const content = body
                    .replace(/[#*`[\]()]/g, "") // Basic markdown strip
                    .replace(/\n+/g, " ") // Replace newlines with spaces
                    .trim();

                return {
                    slug: file.replace(".md", ""),
                    title: attributes.title,
                    date: attributes.date,
                    content,
                };
            })
    );

    return NextResponse.json(posts);
}
