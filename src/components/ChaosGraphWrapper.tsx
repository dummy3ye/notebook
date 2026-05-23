"use client";

import dynamic from "next/dynamic";

const ChaosGraph = dynamic(() => import("./ChaosGraph"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full w-full">
            <p className="text-muted animate-pulse">Initializing Chaos...</p>
        </div>
    ),
});

interface ChaosGraphWrapperProps {
    posts: {
        slug: string;
        title: string;
        tags: string[];
    }[];
}

export default function ChaosGraphWrapper({ posts }: ChaosGraphWrapperProps) {
    return <ChaosGraph posts={posts} />;
}
