import Link from "next/link";

const footerLinks = {
  product: {
    title: "Ürün",
    links: [
      { name: "Özellikler", href: "#features" },
      { name: "Mağaza", href: "#store" },
    ],
  },
  company: {
    title: "Şirket",
    links: [
      { name: "Hakkımızda", href: "#" },
      { name: "Blog", href: "#" },
      { name: "İletişim", href: "#" },
    ],
  },
  support: {
    title: "Destek",
    links: [
      { name: "SSS", href: "#" },
      { name: "Geri Bildirim", href: "#" },
    ],
  },
  legal: {
    title: "Yasal",
    links: [
      { name: "Gizlilik Politikası", href: "#" },
      { name: "Kullanım Şartları", href: "#" },
      { name: "Çerez Politikası", href: "#" },
    ],
  },
};

export function Footer() {
  return (
    <footer id="contact" className="bg-mera-neutral-900 dark:bg-mera-neutral-950 text-mera-neutral-100 dark:text-mera-neutral-200 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-xl font-comfortaa-bold tracking-wider text-mera-neutral-100 dark:text-mera-accent">Mera</span>
            </Link>
            <p className="text-sm text-mera-neutral-500 dark:text-mera-neutral-500 max-w-xs">
              Yapay zeka destekli akıllı balıkçı asistanınız. Profesyonel av deneyimi için tek adresiniz.
            </p>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold mb-4 text-mera-neutral-200 dark:text-mera-neutral-100">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-mera-neutral-500 hover:text-mera-neutral-100 dark:text-mera-neutral-500 dark:hover:text-mera-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-mera-neutral-800 dark:border-mera-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-mera-neutral-500">
            © 2026 Mera. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
