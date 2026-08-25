export interface ICategory {
  id: number;
  userId: number | null;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  type: "expense" | "income" | string;
  isSystem: boolean;
  isActive: boolean;
}

export interface CreateCategoryPayload {
  name: string;
  icon?: string;
  type?: "expense" | "income";
}

export interface UpdateCategoryPayload {
  name?: string;
  icon?: string;
  type?: "expense" | "income";
}
