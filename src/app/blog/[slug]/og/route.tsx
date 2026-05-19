import { ImageResponse } from "next/og";
import fs from "fs/promises";
import path from "path";
import fm from "front-matter";

export const runtime = "nodejs";

interface PostData {
    title: string;
    date: string;
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), "content", `${slug}.md`);

    let title = "Notebook";
    let date = "";

    try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        const { attributes } = fm<PostData>(fileContent);
        title = attributes.title;
        date = attributes.date;
    } catch {
        // Fallback to defaults
    }
    return new ImageResponse(
        <div
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                backgroundColor: "#fff",
                padding: "80px",
                fontFamily: "sans-serif",
            }}
        >
            <div
                style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#000",
                    marginBottom: "20px",
                    letterSpacing: "-0.02em",
                }}
            >
                Notebook.
            </div>
            <div
                style={{
                    fontSize: "64px",
                    fontWeight: "bold",
                    color: "#000",
                    lineHeight: 1.1,
                    marginBottom: "20px",
                    wordBreak: "break-word",
                }}
            >
                {title}
            </div>
            <div
                style={{
                    fontSize: "24px",
                    color: "#666",
                }}
            >
                {date}
            </div>
        </div>,
        {
            width: 1200,
            height: 630,
        }
    );
}
