import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
    const themesDir = path.join(process.cwd(), "src/app/themes");
    const files = await fs.readdir(themesDir);

    const themes = files
        .filter((file) => file.endsWith(".css"))
        .map((file) => {
            const id = file.replace(".css", "");
            // Capitalize first letter and handle common naming conventions
            const label = id
                .split(/[-_]/)
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            return {
                id,
                label,
                class: id,
            };
        });

    // Add built-in themes if they aren't in the directory
    const builtIn = [
        { id: "catppuccin", label: "Catppuccin", class: "catppuccin" },
    ];

    // Combine and remove duplicates based on ID
    const allThemes = [...themes];
    builtIn.forEach((bt) => {
        if (!allThemes.find((t) => t.id === bt.id)) {
            allThemes.push(bt);
        }
    });

    return NextResponse.json(allThemes);
}
