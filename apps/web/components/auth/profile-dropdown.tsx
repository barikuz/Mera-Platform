"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import type { User } from "@supabase/supabase-js";

/**
 * Kullanıcının baş harflerini hesaplar.
 */
function getInitials(user: User): string {
  const displayName = user.user_metadata?.display_name as string | undefined;

  if (displayName) {
    return displayName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  if (user.email) {
    return user.email[0].toUpperCase();
  }

  return "?";
}

/**
 * Kullanıcının görünen adını döndürür.
 */
function getDisplayName(user: User): string {
  const displayName = user.user_metadata?.display_name as string | undefined;
  return displayName || user.email || "Kullanıcı";
}

interface ProfileDropdownProps {
  user: User;
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;

  // Dışarı tıklanınca kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Escape ile kapat
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  async function handleLogout() {
    setIsOpen(false);
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        id="profile-dropdown-trigger"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 dark:bg-primary/20 border-2 border-primary/30 dark:border-primary/40 text-primary font-semibold text-sm cursor-pointer transition-all hover:border-primary/60 hover:bg-primary/20 dark:hover:bg-primary/30 active:scale-95 overflow-hidden"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Profil menüsü"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={getDisplayName(user)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{getInitials(user)}</span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-card shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50"
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-card-foreground truncate">
              {getDisplayName(user)}
            </p>
            {user.email && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {user.email}
              </p>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1.5">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push("/profile");
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-card-foreground hover:bg-secondary/50 dark:hover:bg-mera-neutral-700/50 transition-colors cursor-pointer"
              role="menuitem"
            >
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              Profilim
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-border py-1.5">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-mera-status-error hover:bg-mera-status-error/10 transition-colors cursor-pointer"
              role="menuitem"
            >
              <LogOut className="h-4 w-4" />
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
