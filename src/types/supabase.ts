export interface LessonRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  rating: number;
  tags: string[];
  read_time: string;
  difficulty: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CafeRow {
  id: string;
  name: string;
  city: string;
  description: string;
  image: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface AdminSettingRow {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}
