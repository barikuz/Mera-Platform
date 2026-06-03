"use client";

import Link from "next/link";
import { LogOut, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileSidebarProps {
  displayName: string;
  email: string;
  avatarUrl?: string;
  initials: string;
  onLogout: () => void;
}

export function ProfileSidebar({
  displayName,
  email,
  avatarUrl,
  initials,
  onLogout,
}: ProfileSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm p-8">
        <div className="flex flex-col items-center gap-4">
          {/* Avatar */}
          <div className="flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 dark:bg-primary/20 border-3 border-primary/30 dark:border-primary/40 text-primary font-bold text-2xl overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          {/* Name & email */}
          <div className="text-center">
            <p className="text-xl font-semibold text-foreground">
              {displayName}
            </p>
            {email && (
              <p className="text-sm text-muted-foreground mt-1">{email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Link href="/profile/add-catch">
          <Button className="w-full h-12 text-base gap-2" size="lg">
            Av Kaydı Ekle
          </Button>
        </Link>

        <Link href="/orders">
          <Button
            variant="outline"
            className="w-full h-12 text-base gap-2"
            size="lg"
          >
            <ShoppingBag className="h-5 w-5" />
            Siparişlerim
          </Button>
        </Link>

        <Button
          variant="outline"
          className="w-full h-12 text-base gap-2 text-mera-status-error hover:text-mera-status-error hover:bg-mera-status-error/10 hover:border-mera-status-error/30"
          size="lg"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5" />
          Çıkış Yap
        </Button>
      </div>
    </div>
  );
}
