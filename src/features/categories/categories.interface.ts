export interface ICategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  type: "expense" | "income" | string;
  isSystem: boolean;
  isActive: boolean;
}
