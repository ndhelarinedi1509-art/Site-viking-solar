export type ServiceColor = 'blue' | 'green' | 'orange' | 'purple' | 'teal' | 'amber';

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  tag: string;
  color: ServiceColor;
  featured: boolean;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  power: string;
  location: string;
  tags: string[];
  features: string[];
  image?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  iconColor: string;
}

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'manager' | 'user';
  avatarUrl?: string;
  createdAt: Date;
  lastSignIn?: Date;
}

export interface SiteSettings {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  heroButtonText: string;
  heroButtonHref: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalVisitors: number;
  pendingQuotes: number;
  newMessages: number;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  text: string;
  date: string;
}

export interface Actualite {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image?: string;
  category: string;
  featured?: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface PageSection {
  id: string;
  page_key: string;
  section_key: string;
  section_type: SectionType;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  content: Record<string, unknown>;
  images: MediaItem[];
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string;
}

export type SectionType = 'hero' | 'text' | 'cards' | 'image-text' | 'cta' | 'gallery' | 'faq' | 'team' | 'stats' | 'benefits';

export interface MediaItem {
  url: string;
  alt?: string;
  caption?: string;
}

export interface SiteMedia {
  id: string;
  url: string;
  alt: string;
  caption: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  width: number;
  height: number;
  created_at: string;
  created_by: string;
}

export interface PageInfo {
  key: string;
  label: string;
  icon: string;
  sections: number;
  published: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
