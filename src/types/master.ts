import type { SpecTemplateItem } from "#/components/ui/CategorySidebar";

export interface FeaturedProduct {
  id: string;
  name: string;
  slug: string;
  code: string | null;
  description: string | null;
  price: string | number;
  stock: number;
  isActive: boolean;
  specValues: SpecTemplateItem[];
  images: FileData[];
  subCategory: SubCategory;
}

export interface FileData {
  id: string;
  role: string;
  url: string | null;
}

export interface SubCategory {
  id: string;
  categoryId: string | null;
  name: string;
  slug: string;

  orderIndex: number;
  showInMenu: boolean;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  category: Category;
  files: FileData[];
  products?: FeaturedProduct[];
}

export interface Category {
  id: string;
  description: string;
  name: string;
  slug: string;
  orderIndex: number;
  showInMenu: boolean;
  isActive: boolean;
  specTemplate: string | Record<string, unknown> | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  subCategories: SubCategory[];
}
