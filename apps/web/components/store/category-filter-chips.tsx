import { Button } from "@/components/ui/button";
import { InlineLoader } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export type FilterChip = {
  id: string;
  label: string;
};

type CategoryFilterChipsProps = {
  chips: FilterChip[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
  scrollable?: boolean;
  isLoading?: boolean;
  loadingLabel?: string;
};

export function CategoryFilterChips({
  chips,
  activeId,
  onSelect,
  className,
  scrollable = false,
  isLoading = false,
  loadingLabel = "Kategoriler...",
}: CategoryFilterChipsProps) {
  const chipList = (
    <>
      {chips.map((chip) => (
        <Button
          key={chip.id}
          type="button"
          variant={activeId === chip.id ? "default" : "outline"}
          size="sm"
          className={cn("rounded-full", scrollable && "shrink-0")}
          onClick={() => onSelect(chip.id)}
        >
          {chip.label}
        </Button>
      ))}
      {isLoading && (
        <div className="flex items-center px-2">
          <InlineLoader text={loadingLabel} />
        </div>
      )}
    </>
  );

  if (scrollable) {
    return (
      <div className={cn("-mx-1 overflow-x-auto px-1 pb-1", className)}>
        <div className="flex w-max min-w-full gap-2 sm:min-w-0 sm:flex-wrap">
          {chipList}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {chipList}
    </div>
  );
}
