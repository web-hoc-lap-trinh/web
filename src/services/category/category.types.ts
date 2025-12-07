import type { ICategory } from "../../types/category.types";

export interface CreateCategoryPayload {
  name: string;
  order_index: number;
  icon_file?: File;
}

export interface UpdateCategoryPayload {
  name?: string;
  order_index?: number;
  icon_file?: File;
}

export interface CategoryResponse {
  category: ICategory;
}

export interface CategoriesResponse {
  categories: ICategory[];
}
