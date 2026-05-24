import { Inbox } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 border border-primary/20">
        <Inbox className="h-8 w-8 text-primary/60" />
      </div>
      <div>
        <p className="text-lg font-semibold text-foreground">
          Henüz av kaydı yok
        </p>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          İlk avınızı kaydettiğinizde istatistikleriniz burada görünecek.
        </p>
      </div>
    </div>
  );
}
