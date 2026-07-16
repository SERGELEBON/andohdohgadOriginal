import { useState } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';
import { X, User, Mail, Lock, Shield } from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

const roleLabels = {
  admin: { label: 'Administrateur', description: 'Accès complet au dashboard', color: 'bg-purple-100 text-purple-700' },
  coworking_client: { label: 'Client Coworking', description: 'Accès aux espaces co-working', color: 'bg-blue-100 text-blue-700' },
  standard_client: { label: 'Client Standard', description: 'Accès standard aux services', color: 'bg-green-100 text-green-700' },
  visitor: { label: 'Visiteur', description: 'Accès limité', color: 'bg-gray-100 text-gray-700' },
};

export default function CreateUserModal({ isOpen, onClose, onUserCreated }: CreateUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'visitor' as 'admin' | 'coworking_client' | 'standard_client' | 'visitor',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.first_name) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    if (form.password.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      // 1. Créer l'utilisateur dans auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: form.email,
        password: form.password,
        email_confirm: true,
        user_metadata: {
          first_name: form.first_name,
          last_name: form.last_name,
          role: form.role,
        },
      });

      if (authError) throw authError;

      // 2. Créer le profil dans profiles (si le trigger n'existe pas)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          email: form.email,
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone || null,
          role: form.role,
        }]);

      if (profileError && profileError.code !== '23505') { // Ignore duplicate key error
        throw profileError;
      }

      alert(`Utilisateur ${form.email} créé avec succès !`);
      onUserCreated();
      handleClose();
    } catch (error: any) {
      console.error('Error creating user:', error);
      alert(`Erreur : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      phone: '',
      role: 'visitor',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark">Créer un utilisateur</h2>
              <p className="text-sm text-gray-600">Ajouter un nouvel utilisateur avec son rôle</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Email & Password */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="exemple@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Mot de passe *
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Min. 6 caractères"
                minLength={6}
                required
              />
            </div>
          </div>

          {/* First Name & Last Name */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom *
              </label>
              <input
                type="text"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Prénom"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom
              </label>
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Nom"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="+225 XX XX XX XX XX"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Shield className="w-4 h-4 inline mr-1" />
              Rôle de l'utilisateur *
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(roleLabels).map(([roleKey, roleInfo]) => (
                <label
                  key={roleKey}
                  className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    form.role === roleKey
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={roleKey}
                    checked={form.role === roleKey}
                    onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                    className="mt-1"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-dark">{roleInfo.label}</span>
                      {form.role === roleKey && (
                        <span className={`px-2 py-0.5 text-xs rounded-full ${roleInfo.color}`}>
                          Sélectionné
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{roleInfo.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer l\'utilisateur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
