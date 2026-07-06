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
