import type { ShopCategory } from "@/lib/shop-api";

export type CategoryFilterChip = {
  id: string;
  label: string;
};

export function buildCategoryNameMap(
  categories: ShopCategory[]
): Map<string, string> {
  const map = new Map<string, string>();
  for (const c of categories) {
    if (c.id && c.name) {
      map.set(c.id, c.name);
    }
  }
  return map;
}

/** Mağaza sayfası chip listesi: tek "Tümü" + API kategorileri (id ve isim ile tekilleştirilmiş). */
export function buildStoreCategoryChips(
  categories: ShopCategory[]
): CategoryFilterChip[] {
  const chips: CategoryFilterChip[] = [{ id: "all", label: "Tümü" }];
  const seenIds = new Set<string>();
  const seenLabels = new Set<string>();

  for (const cat of categories) {
    if (!cat.id || seenIds.has(cat.id)) continue;

    const label = (cat.name ?? "").trim();
    if (!label) continue;
    if (label.localeCompare("Tümü", "tr", { sensitivity: "accent" }) === 0) {
      continue;
    }

    const labelKey = label.toLocaleLowerCase("tr");
    if (seenLabels.has(labelKey)) continue;

    seenIds.add(cat.id);
    seenLabels.add(labelKey);
    chips.push({ id: cat.id, label });
  }

  return chips;
}
