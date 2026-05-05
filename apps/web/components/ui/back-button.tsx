import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  href?: string;
  className?: string;
  label?: string;
}

export function BackButton({ 
  href = "/", 
  className,
  label = "Ana Sayfaya Dön" 
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "absolute left-4 top-4 md:left-8 md:top-8 flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
        className
      )}
      aria-label={label}
    >
      <ArrowLeft className="h-5 w-5" />
    </Link>
  );
}
