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
        
        // Basic excerpt extraction (first 150 chars)
        const excerpt = body.slice(0, 150).replace(/[#*`]/g, "").trim() + "...";

        return {
          slug: file.replace(".md", ""),
          title: attributes.title,
          date: attributes.date,
          excerpt,
        };
      })
  );

  return NextResponse.json(posts);
}
