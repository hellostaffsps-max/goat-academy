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
  path: string | null;
  content: string;
  image: string | null;
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

export interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  category_label: string;
  tags: string[];
  read_time: string;
  date: string;
  author: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface SuccessStoryRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  location: string;
  image: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface LearningPathRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  lessons: string[];
  lesson_count: number;
  icon: string;
  color: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}
