"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "hero", label: "Ana Sayfa" },
  { id: "features", label: "Özellikler" },
  { id: "how-it-works", label: "Nasıl Çalışır" },
  { id: "store", label: "Mağaza" },
  { id: "cta", label: "Başlayın" },
];

export function SectionNav() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show nav after scrolling past hero
      setIsVisible(window.scrollY > 300);

      // Determine active section based on scroll position
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={cn(
        "fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3 transition-all duration-500",
        isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-4 pointer-events-none"
      )}
    >
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className="group flex items-center gap-3"
          aria-label={`Navigate to ${section.label}`}
        >
          {/* Label - appears on hover */}
          <span
            className={cn(
              "text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-300",
              "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
              activeSection === section.id
                ? "bg-primary text-primary-foreground"
                : "bg-background/80 text-muted-foreground backdrop-blur-sm border border-border"
            )}
          >
            {section.label}
          </span>

          {/* Dot indicator */}
          <span
            className={cn(
              "relative flex items-center justify-center w-3 h-3 transition-all duration-300",
              activeSection === section.id && "scale-125"
            )}
          >
            {/* Outer ring for active */}
            <span
              className={cn(
                "absolute inset-0 rounded-full transition-all duration-300",
                activeSection === section.id
                  ? "bg-primary/20 scale-[2]"
                  : "bg-transparent scale-100"
              )}
            />
            {/* Inner dot */}
            <span
              className={cn(
                "relative w-2.5 h-2.5 rounded-full transition-all duration-300",
                activeSection === section.id
                  ? "bg-primary"
                  : "bg-muted-foreground/40 group-hover:bg-muted-foreground"
              )}
            />
          </span>
        </button>
      ))}
    </nav>
  );
}
