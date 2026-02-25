"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    className?: string;
}

export default function FadeIn({
    children,
    delay = 0,
    direction = "up",
    className = "",
}: FadeInProps) {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        if (domRef.current) observer.unobserve(domRef.current);
                    }
                });
            },
            { rootMargin: "0px", threshold: 0.1 }
        );

        // Store ref value in variable to avoid eslint warning in cleanup
        const currentRef = domRef.current;

        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    const getDirectionClasses = () => {
        switch (direction) {
            case "up":
                return "translate-y-8";
            case "down":
                return "-translate-y-8";
            case "left":
                return "translate-x-8";
            case "right":
                return "-translate-x-8";
            case "none":
                return "";
            default:
                return "translate-y-8";
        }
    };

    return (
        <div
            ref={domRef}
            className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0 translate-x-0" : `opacity-0 ${getDirectionClasses()}`
                } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
