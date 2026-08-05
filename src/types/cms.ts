import type { Banner } from "#/components/ui/BannerSlide";
import type { FileData } from "./master";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  publishedAt: string;
  blogCategory: BlogCategory;
  files: FileData[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface IPage {
  id: string;
  title: string;
  description: string | null;
  content: string;
}

export interface BannerProps {
  top: Banner[];
  middle: Banner[];
  bottom: Banner[];
  hero: Banner[];
}
