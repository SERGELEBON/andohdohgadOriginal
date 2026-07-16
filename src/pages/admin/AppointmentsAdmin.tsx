import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';
import AdminLayout from '@/components/layout/AdminLayout';
import { Calendar, Check, X, Clock } from 'lucide-react';

interface Appointment {
  id: string;
  service: string;
  appointment_date: string;
  time_slot: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string | null;
  created_at: string;
  user_id: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string;
    phone: string | null;
  };
}

const statusConfig = {
  pending: { label: 'En attente', color: 'bg-amber-100 text-amber-700', icon: Clock },
  confirmed: { label: 'Confirmé', color: 'bg-green-100 text-green-700', icon: Check },
  cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-700', icon: X },
  completed: { label: 'Terminé', color: 'bg-blue-100 text-blue-700', icon: Check },
};

export default function AppointmentsAdmin() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .order('appointment_date', { ascending: false })
        .order('time_slot', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setAppointments(appointments.map(a =>
        a.id === id ? { ...a, status: newStatus as any } : a
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const filteredAppointments = appointments.filter(apt =>
    filter === 'all' || apt.status === filter
  );

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
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
          <h1 className="text-2xl font-bold text-dark mb-2">Gestion des Rendez-vous</h1>
          <p className="text-gray-600">{stats.total} rendez-vous au total</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Total</div>
            <div className="text-2xl font-bold text-dark">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">En attente</div>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Confirmés</div>
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Terminés</div>
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Tous
          </button>
          {Object.entries(statusConfig).map(([status, config]) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun rendez-vous trouvé</p>
            </div>
          ) : (
            filteredAppointments.map((apt) => {
              const StatusIcon = statusConfig[apt.status].icon;
              return (
                <div key={apt.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-dark">{apt.service}</h3>
                          <p className="text-sm text-gray-600">
                            {apt.profiles.first_name && apt.profiles.last_name
                              ? `${apt.profiles.first_name} ${apt.profiles.last_name}`
                              : apt.profiles.email}
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Date :</span>
                          <span className="ml-2 font-medium">
                            {new Date(apt.appointment_date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Heure :</span>
                          <span className="ml-2 font-medium">{apt.time_slot}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Contact :</span>
                          <span className="ml-2 font-medium">{apt.profiles.phone || apt.profiles.email}</span>
                        </div>
                      </div>

                      {apt.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                          <span className="font-medium">Notes :</span> {apt.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <span className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${statusConfig[apt.status].color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[apt.status].label}
                      </span>

                      {apt.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStatus(apt.id, 'confirmed')}
                            className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                            title="Confirmer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStatus(apt.id, 'cancelled')}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                            title="Annuler"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => updateStatus(apt.id, 'completed')}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium rounded-lg transition-colors"
                        >
                          Marquer terminé
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
