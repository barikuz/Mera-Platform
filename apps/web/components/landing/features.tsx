import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ShoppingBag, BarChart3, Target, Lightbulb } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Mera Önerisi",
    description:
      "Hava, mevsim ve konum verilerinizi analiz ederek size en uygun avlak noktalarını önerir.",
    badge: "AI Destekli",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Target,
    title: "Ekipman Tavsiyesi",
    description:
      "Hedef balığına ve meranın koşullarına en uygun olta, makine ve yem kombinasyonunu oluşturur.",
    badge: "Kişiselleştirilmiş",
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    icon: Lightbulb,
    title: "Teknik İpuçları",
    description:
      "Günün en iyi avlanma saatlerini, etkili düğüm çeşitlerini ve ava özel profesyonel teknikleri öğrenin.",
    badge: "Uzman Tavsiyeleri",
    color: "bg-chart-4/20 text-chart-4",
  },
  {
    icon: ShoppingBag,
    title: "Balıkçı Mağazası",
    description:
      "Kaliteli oltalar, makineler, yemler ve tüm balıkçılık ekipmanlarını tek bir yerden temin edin.",
    badge: "Online Mağaza",
    color: "bg-chart-2/20 text-chart-2",
  },
  {
    icon: BarChart3,
    title: "Av İstatistikleri",
    description:
      "Tüm avlarınızı kaydedin, performansınızı takip edin ve gelişiminizi analiz edin.",
    badge: "Analitik",
    color: "bg-chart-1/20 text-chart-1",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            Özellikler
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Balıkçılık Deneyiminizi
            <span className="text-primary"> Dönüştürün</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Mera ile profesyonel balıkçılık artık herkes için erişilebilir.
            Yapay zeka destekli araçlarımızla avınızı optimize edin.
          </p>
        </div>

        {/* Features Grid - 5 cards layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.slice(0, 3).map((feature) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden border-border/50 bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6 lg:p-8">
                <div
                  className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="mb-3 text-xs">
                  {feature.badge}
                </Badge>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom row - 2 cards centered */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 mt-6 lg:mt-8 max-w-4xl mx-auto">
          {features.slice(3).map((feature) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden border-border/50 bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6 lg:p-8">
                <div
                  className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="mb-3 text-xs">
                  {feature.badge}
                </Badge>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
