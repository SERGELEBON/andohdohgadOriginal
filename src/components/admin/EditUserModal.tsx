import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase/supabaseClient';

export type UserRole = 'admin' | 'coworking_client' | 'standard_client' | 'visitor';

export interface EditableUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  company_name?: string | null;
  role: UserRole;
}

interface Props {
  user: EditableUser | null;
  roleLocked: boolean; // super admin : rôle non modifiable
  roleLabels: Record<UserRole, { label: string }>;
  onClose: () => void;
  onSaved: (user: EditableUser) => void;
}

export default function EditUserModal({ user, roleLocked, roleLabels, onClose, onSaved }: Props) {
  const [form, setForm] = useState<EditableUser | null>(user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- réinitialise le formulaire à chaque ouverture
    setForm(user);
    setError('');
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [user, onClose]);

  if (!user || !form) return null;

  const set = (field: keyof EditableUser) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const changes: Partial<EditableUser> = {
      first_name: form.first_name?.trim() || null,
      last_name: form.last_name?.trim() || null,
      phone: form.phone?.trim() || null,
      company_name: form.company_name?.trim() || null,
    };
    if (!roleLocked) changes.role = form.role;

    // .select() : on vérifie que la ligne a réellement été modifiée (RLS)
    const { data, error: err } = await supabase.from('profiles').update(changes).eq('id', form.id).select().single();
    setSaving(false);
    if (err || !data) {
      console.error('Error updating user:', err);
      setError("La modification n'a pas pu être enregistrée.");
      return;
    }
    onSaved(data as EditableUser);
  };

  const input = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10';

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 overflow-y-auto" onClick={onClose}>
      <div className="min-h-full flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-user-title"
          className="bg-white rounded-xl shadow-xl w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div>
              <h2 id="edit-user-title" className="text-lg font-semibold text-dark">Modifier l'utilisateur</h2>
              <p className="text-sm text-gray-500">{form.email}</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Fermer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={save} className="p-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block text-sm">
                <span className="block font-medium text-dark mb-1">Prénom</span>
                <input value={form.first_name ?? ''} onChange={set('first_name')} className={input} />
              </label>
              <label className="block text-sm">
                <span className="block font-medium text-dark mb-1">Nom</span>
                <input value={form.last_name ?? ''} onChange={set('last_name')} className={input} />
              </label>
            </div>
            <label className="block text-sm">
              <span className="block font-medium text-dark mb-1">Téléphone</span>
              <input type="tel" value={form.phone ?? ''} onChange={set('phone')} className={input} />
            </label>
            <label className="block text-sm">
              <span className="block font-medium text-dark mb-1">Entreprise</span>
              <input value={form.company_name ?? ''} onChange={set('company_name')} className={input} />
            </label>
            <label className="block text-sm">
              <span className="block font-medium text-dark mb-1">Rôle</span>
              <select value={form.role} onChange={set('role')} disabled={roleLocked} className={`${input} disabled:bg-gray-50 disabled:text-gray-500`}>
                {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                  <option key={r} value={r}>{roleLabels[r].label}</option>
                ))}
              </select>
              {roleLocked && <span className="block text-xs text-gray-500 mt-1">Le rôle du super administrateur ne peut pas être modifié.</span>}
            </label>
            <p className="text-xs text-gray-500">L'email sert d'identifiant de connexion et ne se modifie pas ici.</p>

            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50">
                Annuler
              </button>
              <button type="submit" disabled={saving} className="btn-primary text-sm px-5 py-2 disabled:opacity-60">
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
