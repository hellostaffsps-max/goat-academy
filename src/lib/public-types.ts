import type {
  LessonRow,
  ArticleRow,
  LearningPathRow,
  SuccessStoryRow,
} from "@/types/supabase";
export type PublicLesson = Omit<LessonRow, "created_at" | "updated_at"> & {
  created_at?: string;
  updated_at?: string;
};
export type PublicArticle = Omit<ArticleRow, "created_at" | "updated_at"> & {
  created_at?: string;
  updated_at?: string;
};
export type PublicPath = Omit<LearningPathRow, "created_at" | "updated_at">;
export type SiteContent = Record<string, Record<string, unknown>>;
export interface PublicContent {
  lessons?: PublicLesson[];
  articles?: PublicArticle[];
  paths?: PublicPath[];
  stories?: SuccessStoryRow[];
  siteContent?: SiteContent;
}
