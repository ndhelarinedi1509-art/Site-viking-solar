import { createClient } from '@/lib/supabase/server';
import type { PaginationParams, PaginatedResponse } from '@/types';

// ===========================================
// PROJECTS
// ===========================================

export async function getProjects() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*, category:categories(*)')
    .order('order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getProjectById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// ===========================================
// SERVICES
// ===========================================

export async function getServices() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('order', { ascending: true });

  if (error) throw error;
  return data;
}

// ===========================================
// TEAM MEMBERS
// ===========================================

export async function getTeamMembers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('order', { ascending: true });

  if (error) throw error;
  return data;
}

// ===========================================
// FAQ ITEMS
// ===========================================

export async function getFAQItems() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('faq_items')
    .select('*')
    .order('order', { ascending: true });

  if (error) throw error;
  return data;
}

// ===========================================
// TESTIMONIALS
// ===========================================

export async function getTestimonials() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// ===========================================
// CONTACT MESSAGES
// ===========================================

export async function getContactMessages(
  pagination: PaginationParams = { page: 1, limit: 20 }
) {
  const supabase = await createClient();
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;

  const [messagesResult, countResult] = await Promise.all([
    supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1),
    supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true }),
  ]);

  if (messagesResult.error) throw messagesResult.error;
  if (countResult.error) throw countResult.error;

  const total = countResult.count ?? 0;

  const response: PaginatedResponse<typeof messagesResult.data[number]> = {
    data: messagesResult.data,
    error: undefined,
    status: 200,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  return response;
}

export async function createContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}) {
  const supabase = await createClient();

  const { data: result, error } = await supabase
    .from('contact_messages')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return result;
}

// ===========================================
// NEWSLETTER SUBSCRIBERS
// ===========================================

export async function createNewsletterSubscription(email: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ===========================================
// SITE SETTINGS
// ===========================================

export async function getSiteSettings() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('site_settings')
    .select('*');

  if (error) throw error;

  // Convert key-value array to an object
  return data.reduce<Record<string, unknown>>((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
}

// ===========================================
// ACTIVITY LOGS
// ===========================================

export async function getActivityLogs(
  pagination: PaginationParams = { page: 1, limit: 20 }
) {
  const supabase = await createClient();
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;

  const [logsResult, countResult] = await Promise.all([
    supabase
      .from('activity_logs')
      .select('*, user:users(full_name, email)')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1),
    supabase
      .from('activity_logs')
      .select('*', { count: 'exact', head: true }),
  ]);

  if (logsResult.error) throw logsResult.error;
  if (countResult.error) throw countResult.error;

  const total = countResult.count ?? 0;

  const response: PaginatedResponse<typeof logsResult.data[number]> = {
    data: logsResult.data,
    error: undefined,
    status: 200,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  return response;
}
