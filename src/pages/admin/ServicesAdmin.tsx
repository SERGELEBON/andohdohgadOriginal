import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import type { Service } from '@/hooks/useDynamicContent';

export default function ServicesAdmin() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setServices(services.map(s =>
        s.id === id ? { ...s, active: !currentStatus } : s
      ));
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const filteredServices = services.filter(service =>
    service.title_fr.toLowerCase().includes(search.toLowerCase()) ||
    service.slug.toLowerCase().includes(search.toLowerCase())
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
      <div className="p-6 lg:p-8 mt-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark mb-2">Gestion des Services</h1>
            <p className="text-gray-600">{services.length} service(s) au total</p>
          </div>
          <button
            onClick={() => navigate('/admin/services/new')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouveau service
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl p-12 text-center border border-gray-100">
              <p className="text-gray-500">
                {search ? 'Aucun service trouvé' : 'Aucun service. Créez-en un !'}
              </p>
            </div>
          ) : (
            filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {service.image_url && (
                  <img
                    src={service.image_url}
                    alt={service.title_fr}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-dark text-lg">{service.title_fr}</h3>
                    <button
                      onClick={() => toggleActive(service.id, service.active)}
                      className={`p-1 rounded ${
                        service.active ? 'text-green-600' : 'text-gray-400'
                      }`}
                      title={service.active ? 'Actif' : 'Inactif'}
                    >
                      {service.active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {service.short_description_fr}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <span className="px-2 py-1 bg-gray-100 rounded">/{service.slug}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Ordre: {service.display_order}</span>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/admin/services/edit/${service.id}`)}
                      className="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors"
                      title="Éditer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteService(service.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
