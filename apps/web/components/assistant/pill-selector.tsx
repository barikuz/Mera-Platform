"use client";

interface PillSelectorProps {
  id: string;
  label: string;
  options: string[];
  selected: string;
  onChange: (next: string) => void;
}

export function PillSelector({
  id,
  label,
  options,
  selected,
  onChange,
}: PillSelectorProps) {
  const toggle = (option: string) => {
    onChange(selected === option ? "" : option);
  };

  return (
    <div className="space-y-3">
      <label
        id={`${id}-label`}
        className="block text-sm font-semibold text-foreground"
      >
        {label}
      </label>
      <div
        role="group"
        aria-labelledby={`${id}-label`}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const isSelected = selected === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              aria-pressed={isSelected}
              className={`
                px-3.5 py-1.5 rounded-full text-sm font-medium
                border transition-all duration-150 cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1
                ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-secondary/60 dark:bg-mera-neutral-800/60 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground hover:bg-secondary dark:hover:bg-mera-neutral-700/70"
                }
              `}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
