import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/layout/AdminLayout';
import { Search, FileText, Download, CheckCircle, Clock, Eye } from 'lucide-react';

interface Purchase {
  id: string;
  user_id: string;
  document_id: string;
  amount_paid: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  document?: {
    title_fr: string;
    category: string;
  };
}

export default function DocumentationAdmin() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const { data, error } = await supabase
        .from('documentation_purchases')
        .select(`
          *,
          user:profiles(first_name, last_name, email),
          document:documentation_items(title_fr, category)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPurchases = purchases.filter(p =>
    p.user?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.user?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.document?.title_fr?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: purchases.length,
    completed: purchases.filter(p => p.payment_status === 'completed').length,
    pending: purchases.filter(p => p.payment_status === 'pending').length,
    revenue: purchases
      .filter(p => p.payment_status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.amount_paid), 0),
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dark mb-2 flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary" />
            Gestion Documentation
          </h1>
          <p className="text-gray-600">{purchases.length} achat(s) au total</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Download className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">Total achats</span>
            </div>
            <div className="text-2xl font-bold text-dark">{stats.total}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Payés</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-amber-100">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-gray-600">En attente</span>
            </div>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          </div>

          <div className="bg-gradient-to-br from-primary to-purple-600 rounded-xl shadow-sm p-5 text-white">
            <div className="text-sm mb-2">Revenus totaux</div>
            <div className="text-2xl font-bold">{stats.revenue.toLocaleString()} F</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Document</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Montant</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Aucun achat trouvé
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-dark">
                          {purchase.user?.first_name} {purchase.user?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{purchase.user?.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-dark">{purchase.document?.title_fr}</div>
                      <div className="text-xs text-gray-500">{purchase.document?.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-dark">
                        {parseFloat(purchase.amount_paid).toLocaleString()} F
                      </div>
                      <div className="text-xs text-gray-500">{purchase.payment_method}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        purchase.payment_status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {purchase.payment_status === 'completed' ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Payé
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            En attente
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(purchase.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Voir détails">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
