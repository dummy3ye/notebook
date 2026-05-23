"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ViewToggle from "./ViewToggle";
import ChaosGraphWrapper from "./ChaosGraphWrapper";
import SearchButton from "./SearchButton";

interface PostEntry {
    slug: string;
    title: string;
    date: string;
    draft?: boolean;
    tags: string[];
}

interface HomeViewProps {
    posts: PostEntry[];
}

export default function HomeView({ posts }: HomeViewProps) {
    const [view, setView] = useState<"list" | "chaos">("list");

    return (
        <div className="flex flex-col min-h-screen">
            <header className="px-6 py-8 sm:px-12 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Notebook.
                        </h1>
                        <p className="text-sm text-muted">
                            {view === "list"
                                ? "Chronological thoughts and discoveries."
                                : "Chaos View: Exploring the connections between thoughts."}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <SearchButton />
                        <ViewToggle view={view} onViewChange={setView} />
                    </div>
                </div>
            </header>

            <main className="flex-1 relative overflow-hidden bg-background">
                <AnimatePresence mode="wait">
                    {view === "list" ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, filter: "blur(10px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, filter: "blur(10px)" }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="flex flex-col items-center px-6 py-24 sm:px-12"
                        >
                            <div className="w-full max-w-2xl">
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
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                >
                                                    <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                                                    <span className="relative z-10">
                                                        {post.title}
                                                    </span>
                                                </Link>
                                            </h2>
                                        </article>
                                    ))}
                                </section>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chaos"
                            initial={{ opacity: 0, filter: "blur(10px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, filter: "blur(10px)" }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="w-full h-full"
                        >
                            <ChaosGraphWrapper posts={posts} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {posts.length === 0 && (
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
