import { supabase } from './supabaseClient';

/**
 * Envoi réel des formulaires publics vers Supabase.
 *
 * Règle : on ne renvoie `ok: true` QUE si la base a répondu sans erreur.
 * L'insert est fait sans `.select()` (return=minimal) : un visiteur anonyme
 * a le droit d'INSERT mais pas de relire la ligne (RLS).
 */

export const WHATSAPP_NUMBER = '2250709577530';

export type SubmitResult = { ok: true } | { ok: false; error: string };

const isConfigured = () =>
  Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

async function currentUserId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id ?? null;
  } catch {
    return null;
  }
}

async function insertRow(table: 'contact_messages' | 'appointments' | 'surveys', row: Record<string, unknown>): Promise<SubmitResult> {
  if (!isConfigured()) {
    return { ok: false, error: 'Configuration Supabase manquante' };
  }
  try {
    const { error } = await supabase.from(table).insert(row);
    if (error) {
      console.error(`[${table}] insert error:`, error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error(`[${table}] network error:`, err);
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur réseau' };
  }
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function submitContactMessage(p: ContactPayload): Promise<SubmitResult> {
  // NB : en production, contact_messages n'a pas de user_id mais a first_name / last_name.
  const fullName = p.name.trim().replace(/\s+/g, ' ');
  const [firstName, ...rest] = fullName.split(' ');
  return insertRow('contact_messages', {
    name: fullName,
    first_name: firstName,
    last_name: rest.join(' '),
    email: p.email.trim(),
    phone: p.phone?.trim() || null,
    subject: p.subject,
    message: p.message.trim(),
    status: 'new',
  });
}

export interface AppointmentPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  service: string; // libellé lisible du service
  date: string; // YYYY-MM-DD
  timeSlot: string; // morning | afternoon
  message?: string;
}

export async function submitAppointment(p: AppointmentPayload): Promise<SubmitResult> {
  return insertRow('appointments', {
    user_id: await currentUserId(),
    first_name: p.firstName.trim(),
    last_name: p.lastName.trim(),
    email: p.email.trim(),
    phone: p.phone.trim(),
    company: p.company?.trim() || null,
    service: p.service,
    appointment_date: p.date,
    time_slot: p.timeSlot,
    message: p.message?.trim() || null,
    status: 'pending',
  });
}

export type ServiceRequestType = 'creation' | 'service' | 'rh' | 'domiciliation' | 'coworking';

export const SERVICE_REQUEST_LABELS: Record<ServiceRequestType, string> = {
  creation: "Création d'entreprise",
  service: 'Service spécifique',
  rh: 'Accompagnement RH',
  domiciliation: 'Domiciliation',
  coworking: 'Co-working',
};

/** Demandes de service (page /sondages et inscription co-working) → table surveys. */
export async function submitServiceRequest(
  type: ServiceRequestType,
  data: { name: string; email: string; phone: string } & Record<string, unknown>,
): Promise<SubmitResult> {
  return insertRow('surveys', {
    survey_type: type,
    form_data: data,
    name: String(data.name).trim(),
    email: String(data.email).trim(),
    phone: String(data.phone).trim(),
    status: 'pending',
  });
}

/** Lien WhatsApp pré-rempli avec le contenu du formulaire, pour ne jamais perdre la demande. */
export function whatsappFallbackUrl(lines: string[]): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.filter(Boolean).join('\n'))}`;
}
