import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: "01",
    title: "Konumunuzu Seçin",
    description: "Bulunduğunuz bölgeyi veya gitmek istediğiniz avlak noktasını belirleyin.",
  },
  {
    number: "02",
    title: "Hedef Balığı Belirleyin",
    description: "Levrek, çipura, lüfer veya diğer hedef balık türünüzü seçin.",
  },
  {
    number: "03",
    title: "AI Önerilerini Alın",
    description: "Yapay zekanın çeşitli parametreleri analiz ederek size sunduğu özel önerileri alın.",
  },
  {
    number: "04",
    title: "Avınıza Başlayın",
    description: "Önerilen ekipman ve tekniklerle profesyonel bir av deneyimi yaşayın.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            Nasıl Çalışır
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            4 Basit Adımda
            <span className="text-primary"> Profesyonel Av</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Mera ile başarılı bir av deneyimi sadece birkaç tık uzağınızda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-border" />
              )}
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground text-2xl font-bold mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
