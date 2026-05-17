"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Header } from "@/components/landing/header";
import { AssistantTabs } from "@/components/assistant/assistant-tabs";
import { TabPanel } from "@/components/assistant/tab-panel";
import { SpotRecommendationForm } from "@/components/assistant/forms/spot-recommendation-form";
import { GearRecommendationForm } from "@/components/assistant/forms/gear-recommendation-form";
import { TechnicalTipsForm } from "@/components/assistant/forms/technical-tips-form";
import { TABS } from "@/constants/assistant";
import { TabId } from "@/types/assistant";

export default function AssistantPage() {
  const [activeTab, setActiveTab] = useState<TabId>("recommendation");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Page heading */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-5">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Mera Asistanı
          </h1>
          <p className="mt-3 text-base text-muted-foreground max-w-xl mx-auto">
            Yapay zeka destekli asistanımız ile en iyi avlanma noktalarını bul, doğru ekipmanı seç ve tekniklerini geliştir.
          </p>
        </div>

        <AssistantTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        <TabPanel tabId="recommendation" activeTab={activeTab}>
          <SpotRecommendationForm />
        </TabPanel>

        <TabPanel tabId="equipment" activeTab={activeTab}>
          <GearRecommendationForm />
        </TabPanel>

        <TabPanel tabId="tips" activeTab={activeTab}>
          <TechnicalTipsForm />
        </TabPanel>
      </main>
    </div>
  );
}
