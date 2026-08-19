import { getBanners, getBlogs } from "#/server/cms";
import { getSiteSettings } from "#/server/master";

export const bannerQueryOptions = (slug: string) => ({
  queryKey: ["banners", slug], // Key-nya HANYA slug
  queryFn: () => getBanners({ data: { pathname: slug } }),
  staleTime: 1000 * 60 * 30, // Tahan selama 30 menit
});

export const blogQueryOptions = (slug: string) => ({
  queryKey: ["blogs", slug],
  queryFn: () =>
    getBlogs({
      data: { slug },
    }),
  staleTime: 1000 * 60 * 5,
});

export const blogSettingsQueryOptions = () => ({
  queryKey: ["site-settings", "blog_page"],
  queryFn: () => getSiteSettings({ data: { key: "blog_page" } }),
  staleTime: 1000 * 60 * 30, // like banners
});
