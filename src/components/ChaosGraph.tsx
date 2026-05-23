"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import { useRouter } from "next/navigation";

interface Node {
    id: string;
    title: string;
    slug: string;
    tags: string[];
    val: number;
    x?: number;
    y?: number;
}

interface Link {
    source: string;
    target: string;
}

interface ChaosGraphProps {
    posts: {
        slug: string;
        title: string;
        tags: string[];
    }[];
}

export default function ChaosGraph({ posts }: ChaosGraphProps) {
    const router = useRouter();
    const graphRef = useRef<ForceGraphMethods>(undefined);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight - 100, // Leave some room for header
            });
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const data = useMemo(() => {
        const nodes: Node[] = posts.map((post) => ({
            id: post.slug,
            title: post.title,
            slug: post.slug,
            tags: post.tags,
            val: 2, // Node size
        }));

        const links: Link[] = [];

        // Connect nodes that share tags
        for (let i = 0; i < posts.length; i++) {
            for (let j = i + 1; j < posts.length; j++) {
                const commonTags = posts[i].tags.filter((tag) =>
                    posts[j].tags.includes(tag)
                );
                if (commonTags.length > 0) {
                    links.push({
                        source: posts[i].slug,
                        target: posts[j].slug,
                    });
                }
            }
        }

        return { nodes, links };
    }, [posts]);

    if (dimensions.width === 0) return null;

    return (
        <div className="w-full h-full min-h-[500px] cursor-grab active:cursor-grabbing">
            <ForceGraph2D
                ref={graphRef}
                graphData={data}
                width={dimensions.width}
                height={dimensions.height}
                backgroundColor="transparent"
                nodeLabel="title"
                nodeColor={() => "var(--foreground)"}
                linkColor={() => "var(--border)"}
                nodeRelSize={6}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.005}
                onNodeClick={(node) => {
                    const n = node as Node;
                    router.push(`/blog/${n.slug}`);
                }}
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const n = node as Node;
                    const label = n.title;
                    const fontSize = 12 / globalScale;
                    ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
                    const textWidth = ctx.measureText(label).width;

                    // Draw node circle
                    ctx.beginPath();
                    ctx.arc(n.x!, n.y!, 4 / globalScale, 0, 2 * Math.PI, false);
                    ctx.fillStyle = "var(--foreground)";
                    ctx.fill();

                    // Draw label
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = "var(--muted)";
                    ctx.fillText(label, n.x!, n.y! + 8 / globalScale);
                }}
            />
        </div>
    );
}
