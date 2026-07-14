import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import CreateUserModal from '@/components/admin/CreateUserModal';
import { Search, Shield, Edit, UserPlus, Trash2, Lock } from 'lucide-react';

interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: 'admin' | 'coworking_client' | 'standard_client' | 'visitor';
  created_at: string;
}

const roleLabels = {
  admin: { label: 'Administrateur', color: 'bg-purple-100 text-purple-700' },
  coworking_client: { label: 'Client Coworking', color: 'bg-blue-100 text-blue-700' },
  standard_client: { label: 'Client Standard', color: 'bg-green-100 text-green-700' },
  visitor: { label: 'Visiteur', color: 'bg-gray-100 text-gray-700' },
};

const SUPER_ADMIN_EMAIL = 'contact@andoh-dohgad.com';

export default function UsersAdmin() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, userEmail: string, newRole: string) => {
    // Bloquer la modification du super admin
    if (userEmail === SUPER_ADMIN_EMAIL) {
      alert('❌ Impossible de modifier le rôle du super administrateur pour des raisons de sécurité.');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(u =>
        u.id === userId ? { ...u, role: newRole as any } : u
      ));

      alert('✅ Rôle mis à jour avec succès');
    } catch (error) {
      console.error('Error updating role:', error);
      alert('❌ Erreur lors de la mise à jour');
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    // Bloquer la suppression du super admin
    if (userEmail === SUPER_ADMIN_EMAIL) {
      alert('❌ Impossible de supprimer le compte super administrateur.');
      return;
    }

    // Bloquer l'auto-suppression
    if (userId === profile?.id) {
      alert('❌ Vous ne pouvez pas supprimer votre propre compte.');
      return;
    }

    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userEmail} ?`)) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.filter(u => u.id !== userId));
      alert('✅ Utilisateur supprimé');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark mb-2">Gestion des Utilisateurs</h1>
            <p className="text-gray-600">{users.length} utilisateur(s) au total</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Créer un utilisateur
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(roleLabels).map(([role, config]) => {
            const count = users.filter(u => u.role === role).length;
            return (
              <div key={role} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{config.label}</span>
                </div>
                <div className="text-2xl font-bold text-dark">{count}</div>
              </div>
            );
          })}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Utilisateur</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Téléphone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Rôle</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Inscription</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-dark">
                            {user.first_name && user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : 'Non renseigné'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '-'}</td>
                    <td className="px-6 py-4">
                      {user.email === SUPER_ADMIN_EMAIL ? (
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${roleLabels[user.role].color}`}>
                            {roleLabels[user.role].label}
                          </span>
                          <Lock className="w-3 h-3 text-gray-400" />
                        </div>
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, user.email, e.target.value)}
                          className={`px-3 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${roleLabels[user.role].color}`}
                        >
                          {Object.entries(roleLabels).map(([role, config]) => (
                            <option key={role} value={role}>{config.label}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          title="Éditer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {user.email !== SUPER_ADMIN_EMAIL && user.id !== profile?.id && (
                          <button
                            onClick={() => deleteUser(user.id, user.email)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Create User Modal */}
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onUserCreated={() => {
            fetchUsers();
          }}
        />
      </div>
    </AdminLayout>
  );
}
