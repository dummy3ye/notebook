"use client";

import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import CopyButton from "@/components/CopyButton";

export default function ClientHydration() {
    useEffect(() => {
        const containers = document.querySelectorAll("[data-copy-button]");
        containers.forEach((container) => {
            const code = container.getAttribute("data-copy-button");
            if (code) {
                const root = createRoot(container);
                root.render(<CopyButton code={JSON.parse(code)} />);
            }
        });
    }, []);

    return null;
}
