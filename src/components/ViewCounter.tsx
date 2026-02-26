"use client";

import { useEffect, useState } from "react";
import { incrementViews } from "@/lib/supabase";

interface ViewCounterProps {
    postId: string;
    initialViews: number;
}

export default function ViewCounter({ postId, initialViews }: ViewCounterProps) {
    const [views, setViews] = useState(initialViews);

    useEffect(() => {
        // Increment views once on page load
        incrementViews(postId);
        setViews((v) => v + 1);
    }, [postId]);

    return (
        <span className="flex items-center gap-1.5 text-sm text-zinc-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {views.toLocaleString('pt-BR')}
        </span>
    );
}
