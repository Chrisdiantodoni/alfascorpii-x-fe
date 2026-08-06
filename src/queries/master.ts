import {
  getCategories,
  getProductByCategory,
  getSubCategoryBySlug,
} from "#/server/master";

export const subCategoryQueryOptions = (slug: string, searchParams: any) => ({
  queryKey: ["subCategory", slug, searchParams], // Key-nya termasuk parameter filter
  queryFn: () =>
    getSubCategoryBySlug({
      data: { slug, filter: searchParams.q }, // Asumsi API Anda menerima filter
    }),
  staleTime: 1000 * 60 * 5,
});

export const categorySlugQueryOptions = (slug: string, searchParams: any) => ({
  queryKey: ["category", slug, searchParams], // Key-nya termasuk parameter filter
  queryFn: () =>
    getProductByCategory({
      data: { slug, filter: searchParams.q }, // Asumsi API Anda menerima filter
    }),
  staleTime: 1000 * 60 * 5,
});
