"use client";

interface TabPanelProps {
  tabId: string;
  activeTab: string;
  children: React.ReactNode;
}

export function TabPanel({ tabId, activeTab, children }: TabPanelProps) {
  return (
    <div
      id={`panel-${tabId}`}
      role="tabpanel"
      aria-labelledby={`tab-${tabId}`}
      hidden={activeTab !== tabId}
    >
      {activeTab === tabId && (
        <div className="rounded-2xl border border-border bg-card dark:bg-card/80 px-6 py-8 sm:px-8 shadow-sm animate-in fade-in-0 duration-300">
          {children}
        </div>
      )}
    </div>
  );
}
