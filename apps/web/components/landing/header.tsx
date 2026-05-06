"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ProfileDropdown } from "@/components/auth/ProfileDropdown";
import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/lib/auth";
import { Menu, Home, ShoppingBag, Sparkles, User, LogOut } from "lucide-react";

const navigation = [
  { name: "Ana Sayfa", href: "/", icon: Home },
  { name: "Mağaza", href: "/store", icon: ShoppingBag },
  { name: "Asistan", href: "/assistant", icon: Sparkles },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  async function handleMobileLogout() {
    setIsOpen(false);
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 dark:bg-mera-neutral-950/90 backdrop-blur-md border-b border-border dark:border-mera-neutral-800/60">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-2xl font-comfortaa-bold text-mera-primary dark:text-mera-accent tracking-wider transition-all duration-300 dark:logo-glow-dark">
              Mera
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex md:items-center md:gap-1 bg-secondary/50 dark:bg-mera-neutral-800/50 rounded-full px-1.5 py-1.5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground rounded-full transition-all hover:text-foreground hover:bg-background/80 dark:hover:bg-mera-neutral-700/50"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex md:items-center md:gap-2">
            <ThemeToggle />
            {isLoading ? (
              /* Skeleton placeholder while auth state loads */
              <div className="h-9 w-9 rounded-full bg-secondary/60 animate-pulse" />
            ) : user ? (
              /* Authenticated: Show profile dropdown */
              <ProfileDropdown user={user} />
            ) : (
              /* Guest: Show login/register buttons */
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Ücretsiz Başla</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
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
                    {isLoading ? (
                      /* Skeleton while loading */
                      <div className="h-10 w-full rounded-md bg-secondary/60 animate-pulse" />
                    ) : user ? (
                      /* Authenticated: Show user info + logout */
                      <>
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/30 dark:bg-mera-neutral-800/40">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/20 border-2 border-primary/30 dark:border-primary/40 text-primary font-semibold text-sm shrink-0">
                            {user.user_metadata?.avatar_url ? (
                              <img
                                src={user.user_metadata.avatar_url as string}
                                alt="Profil"
                                className="h-full w-full rounded-full object-cover"
                              />
                            ) : (
                              <span>
                                {(
                                  (user.user_metadata?.display_name as string) ||
                                  user.email ||
                                  "?"
                                )
                                  .split(" ")
                                  .map((w: string) => w[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {(user.user_metadata?.display_name as string) ||
                                "Kullanıcı"}
                            </p>
                            {user.email && (
                              <p className="text-xs text-muted-foreground truncate">
                                {user.email}
                              </p>
                            )}
                          </div>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground rounded-xl hover:bg-secondary/50 transition-colors"
                        >
                          <User className="h-5 w-5 text-muted-foreground" />
                          Profilim
                        </Link>
                        <button
                          type="button"
                          onClick={handleMobileLogout}
                          className="flex items-center gap-3 px-4 py-3 text-base font-medium text-mera-status-error rounded-xl hover:bg-mera-status-error/10 transition-colors cursor-pointer"
                        >
                          <LogOut className="h-5 w-5" />
                          Çıkış Yap
                        </button>
                      </>
                    ) : (
                      /* Guest: Show login/register buttons */
                      <>
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full">
                            Giriş Yap
                          </Button>
                        </Link>
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          <Button className="w-full">Ücretsiz Başla</Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
