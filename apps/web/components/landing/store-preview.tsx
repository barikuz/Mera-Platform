import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowRight } from "lucide-react";

const products = [
  { id: 1, name: "Shimano Speedmaster Surf", category: "Olta", price: "₺4.599", image: "🎣" },
  { id: 2, name: "Daiwa BG 4000 Spinning", category: "Makine", price: "₺3.299", image: "🔄" },
  { id: 3, name: "Doğal Karides Yem Seti", category: "Yem", price: "₺189", image: "🦐" },
  { id: 4, name: "Su Geçirmez Balıkçı Yeleği", category: "Aksesuar", price: "₺899", image: "🎽" },
];

const categories = ["Tümü", "Oltalar", "Makineler", "Yemler", "Aksesuarlar"];

export function StorePreview() {
  return (
    <section id="store" className="py-20 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <Badge variant="secondary" className="mb-4">Mağaza</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">Balıkçı Mağazası</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Profesyonel balıkçılık ekipmanlarını keşfedin ve avınız için en uygun ürünleri bulun.
            </p>
          </div>
          <Button variant="outline" className="shrink-0">
            Tüm Ürünler
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category, index) => (
            <Button key={category} variant={index === 0 ? "default" : "outline"} size="sm" className="rounded-full">
              {category}
            </Button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-border/50 bg-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="aspect-square bg-secondary/50 flex items-center justify-center text-6xl group-hover:bg-secondary/70 transition-colors">
                  {product.image}
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="mb-2 text-xs">{product.category}</Badge>
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{product.price}</span>
                    <Button size="icon" variant="outline" className="h-9 w-9">
                      <ShoppingCart className="h-4 w-4" />
                      <span className="sr-only">Sepete ekle</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
