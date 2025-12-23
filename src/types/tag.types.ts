export interface ITag {
  tag_id: number;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  order_index: number;
  is_active: boolean;
  problem_count: number;
  created_at: string;
  updated_at: string;
}