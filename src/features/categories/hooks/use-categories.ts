import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { CategoriesService } from "../categories.service";
import { ICategory } from "../categories.interface";

export function useCategories() {
  return useQuery<ICategory[]>({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: () => CategoriesService.listCategories(),
    staleTime: 10 * 60 * 1000, // categories rarely change — 10 min
    gcTime: 60 * 60 * 1000,
  });
}

/** Helper: get category label from slug, falls back to formatted slug */
export function getCategoryLabel(
  slug: string,
  categories: ICategory[],
): string {
  const found = categories.find((c) => c.slug === slug);
  if (found) return found.name;
  // fallback: "peer_to_peer_transfer" → "Peer To Peer Transfer"
  return slug
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
