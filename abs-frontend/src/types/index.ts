export type UserRole = 1 | 2;

export interface AuthUser {
  id: number;
  name: string;
  email?: string;
  role: UserRole;
}

export interface ApiEnvelope<T> {
  success?: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  image_url?: string;
  status?: string;
  location?: string;
  tags?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  image_url?: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  id: number;
  name: string;
  url?: string;
  image?: string;
  created_at?: string;
}

export interface Testimonial {
  id: number;
  author: string;
  role?: string;
  content: string;
  image_url?: string;
  rating?: number;
  featured?: boolean;
  created_at?: string;
}

export interface ActivityRecord {
  id: number;
  title: string;
  user_id?: number;
  user_name?: string;
  created_at: string;
}

export interface SiteData {
  projects?: number;
  offices?: number;
  turnover?: string;
  staffs?: number;
}
