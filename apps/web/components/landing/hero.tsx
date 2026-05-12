import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Sparkles, Fish, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen pt-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-1.5 text-sm font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Yapay Zeka Destekli
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
              Akıllı Balıkçılık
              <span className="block text-primary">Asistanınız</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Hava, mevsim ve konum verilerini analiz ederek en verimli avlak
              noktalarını keşfedin. Profesyonel teknikler ve akıllı ekipman
              önerileriyle avınızı bir üst seviyeye taşıyın.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="group text-base px-8 h-12 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
              >
                Hemen Başla
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-12"
              >
                Nasıl Çalışır?
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  500+
                </div>
                <div className="text-sm text-muted-foreground">
                  Avlak Noktası
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  50K+
                </div>
                <div className="text-sm text-muted-foreground">
                  Aktif Balıkçı
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  98%
                </div>
                <div className="text-sm text-muted-foreground">Memnuniyet</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="relative">
            {/* Main Card */}
            <div className="bg-card rounded-2xl shadow-xl border border-border p-6 lg:p-8">
              {/* Map Preview */}
              <div className="relative rounded-xl overflow-hidden bg-accent/30 h-48 lg:h-56 mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Harita Önizlemesi
                    </span>
                  </div>
                </div>
                {/* Decorative pins */}
                <div className="absolute top-8 left-12 w-3 h-3 bg-primary rounded-full animate-pulse" />
                <div className="absolute top-16 right-16 w-3 h-3 bg-accent rounded-full animate-pulse delay-300" />
                <div className="absolute bottom-12 left-1/3 w-3 h-3 bg-primary rounded-full animate-pulse delay-500" />
              </div>

              {/* Spot Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/30 flex items-center justify-center">
                      <Fish className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        Keban Barajı Çıkışı
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Tatlı Su • 2m - 15m
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-accent/20 text-accent-foreground"
                  >
                    Önerilen
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Fish className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        Hazar Gölü Kuzey
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Tatlı Su • 5m - 30m
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-primary">
                    Görüntüle
                  </Button>
                </div>
              </div>
            </div>

            {/* Floating Card - Equipment */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-lg border border-border p-4 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    className="lucide lucide-fishing-hook-icon lucide-fishing-hook"
                  >
                    <path d="m17.586 11.414-5.93 5.93a1 1 0 0 1-8-8l3.137-3.137a.707.707 0 0 1 1.207.5V10"/>
                    <path d="M20.414 8.586 22 7"/><circle cx="19" cy="10" r="2"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Ekipman Önerisi
                  </div>
                  <div className="text-xs text-muted-foreground">
                    3 parça set hazır
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card - Tips */}
            <div className="absolute -top-4 -right-4 bg-card rounded-xl shadow-lg border border-border p-4 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Akıllı İpucu
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Şafak vakti ideal
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
