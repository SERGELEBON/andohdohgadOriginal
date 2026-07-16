import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';
import AdminLayout from '@/components/layout/AdminLayout';
import { Search, Building2, Users, CheckCircle, XCircle, Clock, Eye, Mail, Phone } from 'lucide-react';

interface Subscription {
  id: string;
  user_id: string;
  plan_type: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'pending';
  price_paid: number;
  payment_method: string;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}

const planLabels: Record<string, string> = {
  daily: 'Journalier',
  weekly: 'Hebdomadaire',
  monthly: 'Mensuel',
  domiciliation: 'Domiciliation',
};

const statusConfig = {
  active: { label: 'Actif', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  expired: { label: 'Expiré', color: 'bg-red-100 text-red-700', icon: XCircle },
  pending: { label: 'En attente', color: 'bg-amber-100 text-amber-700', icon: Clock },
};

export default function CoworkingAdmin() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('coworking_subscriptions')
        .select(`
          *,
          user:profiles(first_name, last_name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('coworking_subscriptions')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setSubscriptions(subscriptions.map(s =>
        s.id === id ? { ...s, status: newStatus as any } : s
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const filteredSubs = subscriptions.filter(sub => {
    const matchesSearch =
      sub.user?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      sub.user?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      sub.user?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    expired: subscriptions.filter(s => s.status === 'expired').length,
    pending: subscriptions.filter(s => s.status === 'pending').length,
    revenue: subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + parseFloat(String(s.price_paid || '0')), 0),
  };

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
      <div className="p-6 lg:p-8 mt-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dark mb-2 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-primary" />
            Gestion Co-working
          </h1>
          <p className="text-gray-600">{subscriptions.length} abonnement(s) au total</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">Total</span>
            </div>
            <div className="text-2xl font-bold text-dark">{stats.total}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Actifs</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-amber-100">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-gray-600">En attente</span>
            </div>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-red-100">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-gray-600">Expirés</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
          </div>

          <div className="bg-gradient-to-br from-primary to-purple-600 rounded-xl shadow-sm p-5 text-white">
            <div className="text-sm mb-2">Revenus mensuels</div>
            <div className="text-2xl font-bold">{stats.revenue.toLocaleString()} F</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="pending">En attente</option>
            <option value="expired">Expiré</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Période</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Montant</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Aucun abonnement trouvé
                  </td>
                </tr>
              ) : (
                filteredSubs.map((sub) => {
                  const StatusIcon = statusConfig[sub.status].icon;
                  return (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-dark">
                            {sub.user?.first_name} {sub.user?.last_name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3" />
                            {sub.user?.email}
                          </div>
                          {sub.user?.phone && (
                            <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3" />
                              {sub.user?.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                          {planLabels[sub.plan_type] || sub.plan_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-dark font-medium">
                            {new Date(sub.start_date).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-gray-500">
                            → {new Date(sub.end_date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-dark">
                          {parseFloat(String(sub.price_paid || '0')).toLocaleString()} F
                        </div>
                        <div className="text-xs text-gray-500">{sub.payment_method}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[sub.status].color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig[sub.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {sub.status === 'pending' && (
                            <button
                              onClick={() => updateStatus(sub.id, 'active')}
                              className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                              title="Activer"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                            title="Voir détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
