import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import ThemePalette from "@/components/ThemePalette";
import Search from "@/components/Search";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://tamakisuoh.vercel.app"),
    title: "Notebook",
    description:
        "A fully functional blog that handles any type of online publishing.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
            suppressHydrationWarning
        >
            <body className="min-h-full flex flex-col" suppressHydrationWarning>
                {children}
                <ThemePalette />
                <Search />
            </body>
        </html>
    );
}
