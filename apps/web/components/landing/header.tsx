"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, ShoppingBag, Sparkles } from "lucide-react";

const navigation = [
  { name: "Ana Sayfa", href: "/", icon: Home },
  { name: "Mağaza", href: "/store", icon: ShoppingBag },
  { name: "Asistan", href: "/assistant", icon: Sparkles },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 text-primary-foreground"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              Mera
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex md:items-center md:gap-1 bg-secondary/50 rounded-full px-1.5 py-1.5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground rounded-full transition-all hover:text-foreground hover:bg-background/80"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex md:items-center md:gap-3">
            <Button variant="ghost" size="sm">
              Giriş Yap
            </Button>
            <Button size="sm">Ücretsiz Başla</Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menüyü aç</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-2 pt-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground rounded-xl hover:bg-secondary/50 transition-colors"
                  >
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    {item.name}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 pt-6 mt-4 border-t border-border">
                  <Button variant="outline" className="w-full">
                    Giriş Yap
                  </Button>
                  <Button className="w-full">Ücretsiz Başla</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
