"use client";

import { TabConfig, TabId } from "@/types/assistant";

interface AssistantTabsProps {
  tabs: TabConfig[];
  activeTab: TabId;
  onChange: (id: TabId) => void;
}

export function AssistantTabs({
  tabs,
  activeTab,
  onChange,
}: AssistantTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Asistan sekmeleri"
      className="flex items-stretch gap-2 p-1.5 rounded-2xl bg-secondary/60 dark:bg-mera-neutral-800/60 border border-border mb-8"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`
              relative flex-1 flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl text-sm font-medium
              transition-all duration-200 cursor-pointer outline-none
              focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1
              ${
                isActive
                  ? "bg-card text-foreground shadow-sm shadow-mera-primary/10 dark:shadow-primary/10 border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50 dark:hover:bg-mera-neutral-700/40 border border-transparent"
              }
            `}
          >
            <tab.icon
              className={`h-5 w-5 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <span className="hidden sm:block">{tab.label}</span>
            <span className="sm:hidden text-xs leading-tight text-center">
              {tab.label}
            </span>

            {/* Active indicator pill */}
            {isActive && (
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
