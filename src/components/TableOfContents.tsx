"use client";

import { useEffect, useState, useRef } from "react";

interface Heading {
    text: string;
    level: number;
    id: string;
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
    const [activeId, setActiveId] = useState<string>("");
    const [progressHeight, setProgressHeight] = useState(0);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;

            // Trigger at 45% down the viewport
            const triggerPoint = scrollY + windowHeight * 0.45;

            let newActiveId = headings[0]?.id || "";

            // Find the last heading that is above the trigger point
            for (const heading of headings) {
                const element = document.getElementById(heading.id);
                if (element) {
                    const top = element.getBoundingClientRect().top + scrollY;
                    if (triggerPoint >= top) {
                        newActiveId = heading.id;
                    }
                }
            }

            // Force-check bottom edge
            if (scrollY + windowHeight >= fullHeight - 10) {
                newActiveId = headings[headings.length - 1].id;
            }

            setActiveId(newActiveId);

            // Progress bar
            const scrolled = Math.min(
                Math.max(scrollY / (fullHeight - windowHeight || 1), 0),
                1
            );
            if (navRef.current) {
                setProgressHeight(scrolled * navRef.current.offsetHeight);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [headings]);

    const handleClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        id: string
    ) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.getBoundingClientRect().top + window.scrollY - 100,
                behavior: "smooth",
            });
            setActiveId(id);
        }
    };

    return (
        <div className="relative ml-1" ref={navRef}>
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-border/20" />
            <div
                className="absolute left-0 top-0 w-[2px] bg-foreground transition-all duration-75 ease-linear z-10"
                style={{ height: `${progressHeight}px` }}
            />

            <nav className="flex flex-col gap-5">
                {headings.map((heading) => (
                    <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        onClick={(e) => handleClick(e, heading.id)}
                        className={`text-sm transition-all duration-300 block relative pl-5 cursor-pointer origin-left ${
                            activeId === heading.id
                                ? "text-foreground font-bold scale-105"
                                : "text-muted hover:text-foreground/80"
                        } ${
                            heading.level === 3
                                ? "ml-4"
                                : heading.level === 4
                                  ? "ml-8"
                                  : ""
                        }`}
                    >
                        {heading.text}
                    </a>
                ))}
            </nav>
        </div>
    );
}
